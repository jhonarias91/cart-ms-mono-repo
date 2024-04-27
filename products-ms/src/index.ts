import express from 'express';
import cors from 'cors';
import {createConnection} from "typeorm";
import {routes} from "./routes";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import {createClient} from "redis";

dotenv.config();

export const client = createClient({
    url: 'redis://redis:6379'
});

createConnection().then(async () => {
    await client.connect();

    const app = express();
    
    app.use(cors({
        credentials: true,
        origin: [process.env.REACT_USERS_BASE_RUL,process.env.CHECKOUT_URL ]
    }));
      
    app.use(express.json());
    const router = express.Router();
    routes(router);
    // Usar el router en la aplicación
    app.use(router);

    app.listen(process.env.PORT, () => {
        console.log('listening to port ',process.env.PORT);
    });
});

