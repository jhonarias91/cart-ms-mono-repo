import {Request, Response} from "express";
import {verify} from "jsonwebtoken";
import {getRepository} from "typeorm";
import { User } from "../models/user";
import firebaseConfig from  "../firebase-adminsdk";
import * as admin from 'firebase-admin';
import {client} from "../index";
import { Console } from "console";

if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig)
    });
  }

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
    try {
        //const jwt = req.cookies['jwt'];
        const token = req.body.token;
        console.log("the firebase token: ", token);
        /*
        const payload: any = verify(jwt, process.env.SECRET_KEY);

        if (!payload) {
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }
*/
        //products will be the ambassador
        const is_ambassador = req.path.indexOf('api/products') >= 0;

        //todo: change to go firebase if fails, go to ms
        const decodedToken = await admin.auth().verifyIdToken(token);   
       /* no cookies on http allowed
        if (!decodedToken){
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }
*/
        //if ((is_ambassador && payload.scope !== 'ambassador') || (!is_ambassador && payload.scope !== 'admin')) {
            if ((!is_ambassador)) {
            return res.status(401).send({
                message: 'unauthorized ambassador'
            });
        }
    
        const user :User = {
            uid: decodedToken.uid,
            first_name: decodedToken.displayName,
            last_name:  "", 
            email: decodedToken.email,
            provider: decodedToken.firebase.sign_in_provider,
            is_ambassador: is_ambassador,
            name : decodedToken.displayName
        }

        req["user"] = user;

        next();
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticated'
        });
    }
}
