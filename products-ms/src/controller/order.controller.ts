import {Request, Response} from "express";
import {getConnection, getRepository} from "typeorm";
import {Order} from "../entity/order.entity";
import {Link} from "../entity/link.entity";
import {Product} from "../entity/product.entity";
import {OrderItem} from "../entity/order-item.entity";
import Stripe from "stripe";
import {client} from "../index";
import {createTransport} from "nodemailer";
import producer  from "../kafka/config";
import { User } from "../models/user";

export const Orders = async (req: Request, res: Response) => {
    const orders = await getRepository(Order).find({
        where: {complete: true},
        relations: ['order_items']
    });

    res.send(orders.map((order: Order) => ({
        id: order.id,
        name: order.name,
        email: order.email,
        total: order.total,
        created_at: order.created_at,
        order_items: order.order_items
    })));
}

export const CreateOrder = async (req: Request, res: Response) => {

    //todo: add validations like total items == 0, etc.

    const body = req.body;

    const link = await getRepository(Link).findOne({
        where: {code: body.code}
    });

    if (!link) {
        return res.status(400).send({
            message: 'Invalid link!'
        });
    }

    const queryRunner = getConnection().createQueryRunner();

    try {
        await queryRunner.connect();
        await queryRunner.startTransaction();

        let order = new Order();
        //order.user_id = link.user.id;
        order.ambassador_email = body.user.email;
        order.uid = body.user.uid;
        order.code = body.code;
        order.first_name = body.first_name;
        order.last_name = body.last_name;
        order.email = body.email;
        order.address = body.address;
        order.country = body.country;
        order.city = body.city;
        order.zip = body.zip;

        order = await queryRunner.manager.save(order);

        const line_items = [];

        for (let p of body.products) {
            const product = await getRepository(Product).findOne(p.product_id);

            const orderItem = new OrderItem();
            orderItem.order = order;
            orderItem.product_title = product.title;
            orderItem.price = product.price;
            orderItem.quantity = p.quantity;
            orderItem.ambassador_revenue = 0.1 * product.price * p.quantity;
            orderItem.admin_revenue = 0.9 * product.price * p.quantity;

            await queryRunner.manager.save(orderItem);

            line_items.push({
                name: product.title,
                description: product.description,
                images: [product.image],
                amount: 100 * product.price,
                currency: 'usd',
                quantity: p.quantity
            });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET, {
            apiVersion: '2020-08-27'
        });

        const source = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            success_url: `${process.env.CHECKOUT_URL}/success?source={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CHECKOUT_URL}/error`
        });

        order.transaction_id = source['id'];
        await queryRunner.manager.save(order);

        await queryRunner.commitTransaction();

        res.send(source);
    } catch (e) {
        //todo: add logging including escential data console.log
        await queryRunner.rollbackTransaction();

        return res.status(400).send({
            message: `Error occurred! - ${e}`
        });
    }
}

export const ConfirmOrder = async (req: Request, res: Response) => {
    const repository = getRepository(Order);

    const order = await repository.findOne({
        where: {
            transaction_id: req.body.source
        },
        relations: ['order_items']
    });

    if (!order) {
        return res.status(404).send({
            message: 'Order not found!'
        });
    }

    await repository.update(order.id, {complete: true});

    //todo call users-ms
    //const user:User = await axios  (User).findOne(order.user_id);

    //todo: check what is the user.name for, could it be the uid from the order
    //await client.zIncrBy('rankings', order.ambassador_revenue, user.name);
    await client.zIncrBy('rankings', order.ambassador_revenue, order.uid);
   
    //Send to event bus
    const value = JSON.stringify({
        ...order, 
        admin_revenue: order.total,
        ambassador_revenue: order.ambassador_revenue
    });

    await producer.connect();
    await producer.send({
        topic:"topic_01",
        messages:[
            {value}
        ]
    })

    res.send({
        message: 'success'
    });
}


export const Rankings = async (req: Request, res: Response) => {
    
    //+inf,-inf: get elements from higher score to lower score
    const result: string[] = await client.sendCommand(['ZREVRANGEBYSCORE', 'rankings', '+inf', '-inf', 'WITHSCORES']);
    let name;

    res.send(result.reduce((o, r) => {
        if (isNaN(parseInt(r))) {
            name = r;
            return o;
        } else {
            return {
                ...o,
                [name]: parseInt(r)
            };
        }
    }, {}));
}

