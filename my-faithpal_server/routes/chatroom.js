import dotenv from 'dotenv';
import express from 'express';
import { connectMongoDB } from '../lib/mongo.js';
import Chatroom from '../models/chatroom.js';

const router = express.Router();
dotenv.config();

router.get('/', (req, res) => {
    res.send('Hello, this is the Chartroom Route');
})

router.post('/create', async (req, res) => {
    try {
        const { name } = await req.body;
        await connectMongoDB();

        const nameRegex = /^[A-Za-z\s]+$/;

        if (!nameRegex.test(name)) throw "Chatroom name can only contain letters of the alphabets";

        const chatroomExists = await Chatroom.findOne({ name });

        if (chatroomExists) throw "Chatroom already exists";
            
        const newChatroom = await Chatroom.create({ name });
        
        res.status(201).json(newChatroom);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
)

export default router;