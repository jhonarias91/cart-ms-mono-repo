import express from 'express';
import * as admin from 'firebase-admin';
import {routes} from "./routes";

const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());
routes(app);
app.listen(PORT, () => {    
  console.log(`Auth server is running on port ${PORT}`);
});

