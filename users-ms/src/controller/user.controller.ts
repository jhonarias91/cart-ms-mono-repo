import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {User} from "../entity/user.entity";
import {client} from "../index";
import {verify} from "jsonwebtoken";
import { EachMessagePayload, Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: 'user_sync-consumer',
    brokers: ['pkc-419q3.us-east4.gcp.confluent.cloud:9092'],
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: 'VLXJXOYVUEFBAQKD',
        password: 'VG9Ma3r32e+Oa8rw7Y5QWhHHujF1pu8LJGzfQQ5jZmkOkUCe3zdIsQdUUUtxppsi'
    }
});
const consumer = kafka.consumer({ groupId: 'user_sync_consumer_group' });

const run = async () => {   
    await consumer.connect();
    await consumer.subscribe({ topic: 'users_sync_topic' });
    await consumer.run({
        eachMessage: async (message: EachMessagePayload) => {
            const user = JSON.parse(message.message.value.toString())           
            const {first_name, last_name,email,uid,provider} = user.user;

            const userSaved = persistUser (first_name, last_name,email,uid,provider);            
            console.log(userSaved);
        }
    })
}
run().then(console.error);

export const Ambassadors = async (req: Request, res: Response) => {
    res.send(await getRepository(User).find({
        is_ambassador: true
    }));
}

export const Rankings = async (req: Request, res: Response) => {

    //Todo: move this to ranking
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

export const UpdateCreate = async (req: Request, res: Response) => {
    const {first_name, last_name,email,uid,provider, ...body} = req.body;

    if (!first_name || !email || !uid) {
        return res.status(400).send({
            message: "first_name, last_name, uid and email are mandatory!"
        })
    }

    try{ 
        const user = persistUser (first_name, last_name,email,uid,provider);
        res.send(user);
    }catch (error){
        console.error('Failed to register:', error);      
        return res.status(500).send({
            message: 'Internal error on register, try later'
        }); 
    }
}

async function persistUser( first_name:string, last_name:string,email:string,uid:string,provider:string){
    const user = await getRepository(User).save({
        first_name, last_name,email,uid,provider
    });

    return user;
}

export const AuthenticatedUser = async (req: Request, res: Response) => {

    const jwt = req.cookies['jwt'];

    const payload: any = verify(jwt, process.env.SECRET_KEY);
    console.log("to get");
    console.log(payload);

    if (!payload) {
        return res.status(401).send({
            message: 'unauthenticated'
        });
    }
    const user = await getRepository(User).findOne(payload.id);    
    console.log(user);
    return res.send(user);
}

export const Logout = async (req: Request, res: Response) => {
    res.cookie("jwt", "", {maxAge: 0});

    res.send({
        message: 'success'
    });
}

