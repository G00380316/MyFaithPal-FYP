import dotenv from 'dotenv';
import express from 'express';
import { connectMongoDB } from '../lib/mongo.js';
import Message from '../models/message.js';

const router = express.Router();
dotenv.config();

    router.get('/', (req, res) => {
        res.send('Hello, this is the Messages Route');
    })

    router.post('/create', async (req, res) => {
    const { chatroom, user , text } = req.body;
        
    try {
        await connectMongoDB();
            
        const response = await Message.create({chatroom, user , text});

        res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })
    
    router.get('/get/:chatroomId', async (req, res) => {
        const chatroom = req.params.chatroomId;

        try {
            await connectMongoDB();

            const messages = await Message.find({ chatroom })

            res.status(200).json(messages);
        } catch (error) {
            //console.log(error);
            res.status(500).json(error);
        }
    })

export default router;