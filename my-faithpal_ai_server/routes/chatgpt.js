import dotenv from 'dotenv';
import express from 'express';
import OpenAI from "openai";
import { connectMongoDB } from '../lib/mongo.js';
import Response from '../models/messages.js';

    const router = express.Router();
    const openai = new OpenAI();
    
    dotenv.config();

    router.get('/', (req, res) => {
        res.send(`Hello, this is the Ai Route make sure your key is in the .env`);
    })

    router.post('/create', async (req, res) => {
        
        const { question , aichatroom } = req.body;
            
        const prompt = "Answer this question only if it's related to the Bible or Christianity and in a Christian or Bible context:  " + question;

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 50,
            });

            const id_AI = process.env.AI_ID;

            await connectMongoDB();

            const answer = response.choices[0];
            
            console.log('ChatGPT Response:', answer.message.content);

            const aiReponse = await Response.create({ aichatroom, user: id_AI , text: answer.message.content , data: answer , prompt });

            res.status(201).json({ response: aiReponse });
        } catch (error) {
            console.error('Error calling OpenAI ChatGPT:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })

    router.get('/get/:aichatroomId', async (req, res) => {
        const aichatroom = req.params.aichatroomId;

        try {
            await connectMongoDB();

            const responses = await Response.find({ aichatroom })

            res.status(200).json(responses);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    })

    export default router;