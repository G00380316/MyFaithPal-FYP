import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

const router = express.Router();
dotenv.config();

router.get('/', (req, res) => {
    res.send('Hello, this is the Bible Route');
})

router.get('/test', async (req, res) => {
    try {
        const apiUrl = 'https://api.scripture.api.bible/v1/bibles/9879dbb7cfe39e4d-04/chapters/GEN.1?include-chapter-numbers=true&include-verse-numbers=true';
        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            throw new Error('API key is missing');
        }

        const response = await axios.get(apiUrl, {
            headers: {
                'api-key': apiKey
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/john1:1', async (req, res) => {
    try {
        const apiUrl = 'https://6ht3rkv1-4000.uks1.devtunnels.ms/john%203:16-20?translation=bbe';

        const response = await axios.get(apiUrl);

        res.json(response.data);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;