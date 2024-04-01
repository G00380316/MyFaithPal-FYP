import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { connectMongoDB } from '../lib/mongo.js';
import Passage from '../models/passage.js';

const router = express.Router();
dotenv.config();

router.get('/', (req, res) => {
    res.send('Hello, this is the Bible Route');
})

router.post('/save/changes', async (req, res) => {
    const { key , props , type , ref , user } = req.body;

    try {
        await connectMongoDB();

        console.log('before search ref:', ref);
        console.log('before search user:', user);

        const passage = await Passage.findOne({ ref, user });
        
        console.log(passage)
        
        if (passage) {
            const updatedPassage = await Passage.updateOne({ ref, user }, { $set: { key, props, type } });

            if (updatedPassage) {
                return res.status(202).json(updatedPassage)
            }
            
            return res.status(200).json(passage);
        };
            
        const newChangedPassage = await Passage.create({ key , props , type , ref , user});

        console.log('ref:', ref);
        console.log('user:', user);

        res.status(201).json(newChangedPassage);

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
});

router.post('/get/changes', async (req, res) => {

    const { ref, user } = await req.body;

    try {
        await connectMongoDB();

        const passage = await Passage.findOne({ ref , user })

        res.status(200).json(passage);

    } catch (error) {

        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });

    }
});

router.post('/get/user/changes', async (req, res) => {

    const { user } = await req.body;

    try {
        await connectMongoDB();

        const passage = await Passage.find({ user })

        res.status(200).json(passage);

    } catch (error) {

        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });

    }
});


router.get('/random', async (req, res) => {
    try {
        const apiUrl = 'http://127.0.0.1:4567/?random=verse';

        const response = await axios.get(apiUrl);

        res.json(response.data);

    } catch (error) {

        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });

    }
});

router.get('/:passage', async (req, res) => {

    const passage = req.params.passage;

    try {
        const apiUrl = `http://127.0.0.1:4567/${passage}`;

        const response = await axios.get(apiUrl);

        res.json(response.data);

    } catch (error) {

        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });

    }
});

router.get('/:passage/:translation', async (req, res) => {

    const passage = req.params.passage;
    const translation = req.params.translation;

    console.log(passage)
    console.log(translation)

    try {
        const apiUrl = `http://127.0.0.1:4567/${passage}?translation=${translation}`;

        const response = await axios.get(apiUrl);

        res.json(response.data);

    } catch (error) {

        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
        
    }
});

export default router;