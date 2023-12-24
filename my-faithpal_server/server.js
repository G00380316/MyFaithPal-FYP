import { connectMongoDB } from "./lib/mongo.js";
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import cors from 'cors';
import express from 'express';

//Routes
import bibleRoutes from './routes/bible.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectMongoDB();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Welcome to Faithpals Backend Servers'));

app.use('/bibles', bibleRoutes);

app.listen(PORT, () => console.log(`Server started on port http://localhost:${PORT}`));