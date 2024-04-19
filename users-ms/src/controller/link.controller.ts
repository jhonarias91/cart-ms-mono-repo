import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {Link} from "../entity/link.entity";

export const Links = async (req: Request, res: Response) => {
    const links = await getRepository(Link).find({
        where: {
            user: req.params.id
        },
        relations: ['orders', 'orders.order_items']
    });

    res.send(links);
}

export const CreateLink = async (req: Request, res: Response) => {
    const user = req['user'];

    const link = await getRepository(Link).save({
        user,
        code: generateRandomString()
        //todo: pendiente valdiar conde orquestar, front,back, kafka.
       // products: req.body.products.map(id => ({id})) todo: send         
    });

    res.send(link);
}

function generateRandomString() {
    let result:string;
    do {
        result = Math.random().toString(36).substring(6);
    } while (result.length < 6);
    return result;
}

export const Stats = async (req: Request, res: Response) => {
    const user = req['user'];

    const links = await getRepository(Link).find({
        where: {user},
        //relations: ['orders', 'orders.order_items']
        //On the front orchest the call to get the Orders related to this link
    });

    res.send(links.map(link => {
        //const orders = link.orders.filter(o => o.complete);

        return {code: link.code};
        //todo: migrate to front
        /*return {
            code: link.code,
            count: orders.length,
            revenue: orders.reduce((s, o) => s + o.ambassador_revenue, 0)
        };*/
    }));
}

export const GetLink = async (req: Request, res: Response) => {
    res.send(await getRepository(Link).findOne({
        where: {
            code: req.params.code
        },
        relations: ['user', 'products']
    }))
}
