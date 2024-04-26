import {Request, Response} from "express";
import  os  from 'os';

export const HealthCheck = async (req: Request, res: Response) => {
    const resp = {
        id: os.hostname() //The pod name
    }
    res.status(200).send(resp);
}

