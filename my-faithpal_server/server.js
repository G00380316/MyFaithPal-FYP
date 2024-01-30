import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from "dotenv";
import express from 'express';
import { connectMongoDB } from "./lib/mongo.js";

//Routes
import Bible from './routes/bible.js';
import Chatroom from "./routes/chatroom.js";
import Message from './routes/message.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectMongoDB();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Welcome to Faithpals Backend Servers'));

app.use('/bible', Bible);
app.use('/chatroom', Chatroom);
app.use('/message', Message);

app.listen(PORT, () => console.log(`Server started on port http://localhost:${PORT}`));