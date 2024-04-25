import {Request, Response} from "express";
import * as admin from 'firebase-admin';
import UserAdapter from "../UserAdapter";
import {CircuitBreakerOptions, UserData} from '../breaker/CircuitBreaker';
import {sign} from "jsonwebtoken";
import dotenv from 'dotenv';
import firebaseConfig from  "../firebase-adminsdk";
import producer  from "../kafka/config";

dotenv.config();

if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig)
    });
  }

const options: CircuitBreakerOptions = {
  failureThreshold: 3,
  baseTimeout: 300, 
  maxTimeout: 20000  
};

const userAdapter = new UserAdapter(process.env.USERS_MS_BASE_URL, options);

export const Login = async (req: Request, res: Response) => {

    try{
        const { tokenId  } = req.body;       
        const decodedToken = await admin.auth().verifyIdToken(tokenId);        
       /*
         {        
         iss: 'https://securetoken.google.com/cart-ms-auth-ms',
         aud: 'cart-ms-auth-ms',
         auth_time: 1713711647,
         user_id: 'cuNIS6z7j4b7DhPiTx3SbNLl3LD3',
         sub: 'cuNIS6z7j4b7DhPiTx3SbNLl3LD3',
         iat: 1713711647,
         exp: 1713715247,
         email: 'jhonarias91@gmail.com',
         email_verified: false,
         firebase: { identities: { email: [Array] }, sign_in_provider: 'password' },
         uid: 'cuNIS6z7j4b7DhPiTx3SbNLl3LD3'
       }*/        
        const adminLogin = req.path === '/api/admin/login';
      
        const token = sign({
          id: decodedToken.uid,
          scope: adminLogin ? "admin" : "ambassador"
      }, process.env.SECRET_KEY);
      
        res.cookie("jwt", token, {
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
            message: 'Login Internal error, try later'
        });  
    }
}

export const Register = async (req: Request, res: Response) => {

  try{
      
    const adminLogin = req.path === '/api/admin/login';
    req.body.is_ambassador = adminLogin;
    
    const maxRetries = 3; // Max number of attempts
    let attempts = 0;
    let userResult;
    
    //Retry mechanism
    while (attempts < maxRetries) {

        const data :UserData = req.body;
        
        try {
            
            userResult = await userAdapter.updateOrCreateUser(data);
            break; // Break the loop if the operation is successful
        } catch (error) {
            attempts++;
            console.error(`Attempt ${attempts} failed:`, error);

            if (attempts >= maxRetries) {
                sendtUserToKafka(data);
                return res.status(200).send({
                    message: 'User was send to queue'
                });
            }

            // Wait 500 milliseconds before retrying
            await new Promise(resolve => setTimeout(resolve, 1001));
        }
    }

    // Send a success response
    res.send({
        message: 'success',
        userDetails: userResult
    });
  }
  catch(error ){
      console.error('Failed to register:', error);      
      return res.status(500).send({
          message: 'Register Internal error, try later'
      });  
  }

  async function sendtUserToKafka(data:any){
        //Send to kafka                         
        const value = JSON.stringify({
            user:data
        })

        const key = data.uid;
        try{
            await producer.connect();
        await producer.send({
            topic:"users_sync_topic",
            messages:[{key, value}]
        })
        }catch (err){
        // Log errors if the operation fails
            console.error('Failed to send message:', err);
        } finally {        
            await producer.disconnect();
        }    
  }


}