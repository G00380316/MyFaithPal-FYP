import axios from "axios";
import dotenv from 'dotenv';
import express from 'express';
import { connectMongoDB } from '../lib/mongo.js';

    const router = express.Router();
    dotenv.config();
    
    const apiKey = 'YOUR_OPENAI_API_KEY';

    router.get('/', (req, res) => {
        res.send(`Hello, this is the Ai Route this is your key ${apiKey}`);
    })

    router.post('/create', async (req, res) => {
        
        const { question } = req.body;
            
        const prompt = 'Translate the following English text to French: "Hello, how are you?"';

        try {
            const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
                prompt: prompt,
                max_tokens: 50,
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                },
            });

            const answer = response.data.choices[0].text;
            console.log('ChatGPT Response:', answer);
        } catch (error) {
            console.error('Error calling OpenAI ChatGPT:', error);
        }
    })

    export default router;