import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import { connectMongoDB } from '../lib/mongo.js';
import sourceKnowledge from '../models/aiSourceKnowledge.js';

const router = express.Router();

dotenv.config();

router.get('/', (req, res) => {
    res.send(`Hello, this is the FaithpalAi Route make sure your key is in the .env`);
});

router.post('/webscrape', async (req, res) => {
    try {
        // Fetched the HTML of the page I want to scrape
        const { data } = await axios.get(process.env.SCRAPE_URL);

        // Load the HTML I fetched in the previous line
        const $ = cheerio.load(data);

        // Select all the list items in plainlist class
        const listItems = $(".content");

        const questions = [];
        const QA = { question: "", answer: "" };

        connectMongoDB();

        // Iterate through each list item and extract text
        listItems.each((idx, el) => {
            QA.question = $(el).children("h1").children("*[itemprop = 'name headline']").text();
            QA.answer = $(el).children("*[itemprop = 'articleBody']").text();
            questions.push(questions);
        });

        const checkData = await sourceKnowledge.create({ question: QA.question, answer: QA.answer });

        console.dir(checkData);

        // Write questions array to question.json file and also returning Json and Message when data has been stored in DataBase
        await fs.promises.writeFile("question.json", JSON.stringify(questions, null, 2));
        console.log("Successfully written data to file");
        res.status(201).json({ response: checkData, message: "Scraping completed successfully!" });
        
    } catch (err) {

        console.error(err);
        res.status(500).send("Internal Server Error");

    }
});

export default router;
