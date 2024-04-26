import express from 'express';
import * as admin from 'firebase-admin';
import {routes} from "./routes";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

app.use(cors({
  credentials: true,
  origin: [process.env.REACT_USERS_BASE_RUL,'http://localhost:3000', 'http://localhost:4000', 'http://localhost:5000']
}));

app.use(express.json());
const router = express.Router();
routes(router);
// Usar el router en la aplicación
app.use(router);

app.listen(PORT, () => {    
  console.log(`Auth server is running on port ${PORT}`, router );
});

