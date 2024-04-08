import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';
import { connectMongoDB } from '../lib/mongo.js';
import Passage from '../models/passage.js';

const router = express.Router();
dotenv.config();

router.get('/', (req, res) => {
    res.send('Hello, this is the Bible Route');
})

router.post('/save/changes', async (req, res) => {
    const { key , props , type , reference , user } = req.body;

    try {
        await connectMongoDB();

        //console.log('before search ref:', reference);
        //console.log('before search user:', user);

        const passage = await Passage.findOne({ reference, user });
        
        //console.log(passage)
        
        if (passage) {
            const updatedPassage = await Passage.updateOne({ reference, user }, { $set: { key, props, type } });

            if (updatedPassage) {
                return res.status(202).json(updatedPassage)
            }
            
            return res.status(200).json(passage);
        };
            
        const newChangedPassage = await Passage.create({ key , props , type , reference , user});

        //console.log('ref:', reference);
        //console.log('user:', user);

        res.status(201).json(newChangedPassage);

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
});

router.post('/get/changes', async (req, res) => {

    const { reference, user } = await req.body;

    try {
        await connectMongoDB();

        const passage = await Passage.findOne({ reference , user })

        res.status(200).json(passage);

    } catch (error) {

        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });

    }
});

router.post('/clear/changes', async (req, res) => {

    const { reference, user } = await req.body;

    try {
        await connectMongoDB();

        const passage = await Passage.findOneAndDelete({ reference , user })

        res.status(202).json(passage);

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
        const apiUrl = `${process.env.BIBLE_SERVER_URL}?random=verse`;

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
        const apiUrl = `${process.env.BIBLE_SERVER_URL}${passage}`;

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

    //console.log(passage)
    //console.log(translation)

    try {
        const apiUrl = `${process.env.BIBLE_SERVER_URL}${passage}?translation=${translation}`;

        const response = await axios.get(apiUrl);

        res.json(response.data);

    } catch (error) {

        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
        
    }
});

export default router;