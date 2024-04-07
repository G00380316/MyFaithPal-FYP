import dotenv from 'dotenv';
import express from 'express';
import Chatroom from '../models/chatroom.js';
import { connectMongoDB } from '../lib/mongo.js';

const router = express.Router();
dotenv.config();

    router.get('/', (req, res) => {
        res.send('Hello, this is the Chartroom Route');
    })

    router.post('/create', async (req, res) => {
    const { firstId, secondId } = req.body;

    try {
        await connectMongoDB();
        const chatroom = await Chatroom.findOne ({
            participants: { $all: [firstId, secondId] },
        });
        
        if (chatroom) {
            return res.status(200).json(chatroom);
        };
            
        const newChatroom = await Chatroom.create({ participants: [firstId, secondId] });

        //console.log('User ID:', firstId);
        //console.log('Second ID:', secondId);
        //console.log('Created Chatroom:', newChatroom);

        res.status(201).json(newChatroom);

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

            const chatrooms = await Chatroom.find({
                participants: { $in: userId } //Replace userId with intUserId for int
            })

            console.log('User ID:', userId);
            console.log('Chatrooms:', chatrooms);

            res.status(200).json(chatrooms);

        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    })
    
    router.get('/find/:firstId/:secondId', async (req, res) => {
        const { firstId, secondId } = req.params;

        //const intFirstUserId = parseInt(firstId);
        //const intSecondUserId = parseInt(secondId);

        try {
            await connectMongoDB();
            
            const chatrooms = await Chatroom.findOne({
                participants: {$all: [firstId,secondId]}
            })

            console.log('User ID:', firstId);
            console.log('Second ID:', secondId);
            console.log('Chatrooms:', chatrooms);
            
            res.status(200).json(chatrooms);

        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
)

export default router;