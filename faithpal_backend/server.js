const express = require('express')
const app = express()
const axios = require('axios')
require('dotenv').config()

app.get('/bible', async (req, res) => {
    try {
        const apiUrl = 'https://api.scripture.api.bible/v1/bibles/685d1470fe4d5c3b-01';
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

app.get('/bibles', async (req, res) => {
    try {
        const apiUrl = 'https://api.scripture.api.bible/v1/bibles';
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

app.get('/john1:1', async (req, res) => {
    try {
        const apiUrl = 'https://bible-api.com/john 1:1';

        const response = await axios.get(apiUrl);

        res.json(response.data);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(8080, () => { console.log("Server started on port http://127.0.0.1:8080")})