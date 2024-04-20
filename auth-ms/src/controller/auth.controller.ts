import {Request, Response} from "express";
import * as admin from 'firebase-admin';
import UserAdapter from "../UserAdapter";
import {CircuitBreakerOptions} from '../breaker/CircuitBreaker';

var serviceAccount = require("./firebase-adminsdk.json");

if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

const options: CircuitBreakerOptions = {
  failureThreshold: 3,
  baseTimeout: 1000, 
  maxTimeout: 5000  
};

const userAdapter = new UserAdapter("http://localhost:80", options);

export const Login = async (req: Request, res: Response) => {

    try{
        const { token } = req.body;
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        console.log(decodedToken);

        userAdapter.updateOrCreateUser(decodedToken);
       
        res.cookie("jwt", decodedToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000//1 day
        })

        res.send({
            message: 'success'
        });
    }
    catch(error ){
        console.error('Failed to login:', error);      
        return res.status(500).send({
            message: 'Internal error, try later'
        });  
    }
}


/*
app.post('/verifyToken', (req, res) => {
    const token = req.body.token;
    admin.auth().verifyIdToken(token)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        // Aquí vincularías el uid de Firebase con tu usuario en la base de datos
        // ...
        res.send('Usuario verificado y vinculado');
        
      }).catch((error) => {
        res.status(401).send('Token inválido');
      });
  });*/