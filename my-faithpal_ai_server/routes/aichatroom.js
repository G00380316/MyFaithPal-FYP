import dotenv from 'dotenv';
import express from 'express';
import { connectMongoDB } from '../lib/mongo.js';
import AIChatroom from '../models/aiChatroom.js';

    const router = express.Router();
    dotenv.config();

    router.get('/', (req, res) => {
        res.send('Hello, this is the AI Chartroom Route');
    })

    router.post('/create', async (req, res) => {
    const { userId } = req.body;

    try {
        await connectMongoDB();

        const id_AI = process.env.AI_ID;
        //To add multiple chat functionality with on person remove this chunck of code
        const chatroom = await AIChatroom.findOne ({
            participants: { $all: [userId, id_AI] },
        });
        
        if (chatroom) {
            return res.status(200).json(chatroom);
        };
        
        const newAIChatroom = await AIChatroom.create({ participants: [userId, id_AI] });

        console.log('User ID:', userId);
        console.log('AI ID:', id_AI);
        console.log('Created an AI Chatroom:', newAIChatroom);

        res.status(201).json(newAIChatroom);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })
    
    router.get('/findall/:userId', async (req, res) => {
        const userId = req.params.userId;

        //const intUserId = parseInt(userId);

        try {
            await connectMongoDB();

            const chatrooms = await AIChatroom.find({
                participants: { $in: userId } //Replace userId with intUserId for int
            })

            console.log('User ID:', userId);
            console.log('AiChatrooms:', chatrooms);

            res.status(200).json(chatrooms);

        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    })
    
    router.get('/find/:userId', async (req, res) => {
        const { userId } = req.params;

        //const intFirstUserId = parseInt(firstId);
        //const intSecondUserId = parseInt(secondId);

        try {
            await connectMongoDB();

            const id_AI = process.env.AI_ID;
            
            const chatrooms = await AIChatroom.findOne({
                participants: {$all: [userId,id_AI]}
            })

            console.log('User ID:', userId);
            console.log('AI ID:', id_AI);
            console.log('AiChatrooms:', chatrooms);
            
            res.status(200).json(chatrooms);

        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
)

export default router;