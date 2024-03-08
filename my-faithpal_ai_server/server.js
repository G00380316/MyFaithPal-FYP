import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from "dotenv";
import express from 'express';
import { connectMongoDB } from "./lib/mongo.js";

//Routes
import Prompt from './routes/prompt.js';
import Chatgpt from './routes/chatgpt.js';
import AIChatroom from './routes/aichatroom.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 80;

connectMongoDB();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Welcome to Faithpals AI Backend Servers'));

app.use('/prompt', Prompt);
app.use('/ai', Chatgpt);
app.use('/aichatroom', AIChatroom);

app.listen(PORT, () => console.log(`Server started on port http://localhost:${PORT}`));