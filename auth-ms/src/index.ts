import express from 'express';
import * as admin from 'firebase-admin';
import {routes} from "./routes";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3500;
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:4000', 'http://localhost:5000']
}));

app.use(express.json());
routes(app);


app.listen(PORT, () => {    
  console.log(`Auth server is running on port ${PORT}`);
});

