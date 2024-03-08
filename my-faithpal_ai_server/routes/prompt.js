import dotenv from 'dotenv';
import express from 'express';
import { connectMongoDB } from '../lib/mongo.js';
import Prompt from '../models/prompt.js';

const router = express.Router();
dotenv.config();

    router.get('/', (req, res) => {
        res.send('Hello, this is the Prompt Route');
    })

    router.post('/create', async (req, res) => {
    const { aichatroom, user , text } = req.body;
        
    try {
        await connectMongoDB();
            
        const response = await Prompt.create({aichatroom, user , text});

        res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })
    
    router.get('/get/:aichatroomId', async (req, res) => {
        const chatroom = req.params.chatroomId;

        try {
            await connectMongoDB();

            const prompts = await Prompt.find({ chatroom })

            res.status(200).json(prompts);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    })

export default router;