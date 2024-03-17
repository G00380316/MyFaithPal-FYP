import axios from 'axios';
import dotenv from 'dotenv';
import express, { response } from 'express';

//read Terminal
import readline from 'readline';

//Webscraping
import * as cheerio from 'cheerio';

//Data
import fs from 'fs';
import { connectMongoDB } from '../lib/mongo.js';
import sourceKnowledge from '../models/aiSourceKnowledge.js';

//AI LangChain
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { MongoClient } from "mongodb";
import { createVectoreStore } from '../lib/AI/CreateVectorMongoDB.js';
import { RetrievalQAChain } from "langchain/chains";
import { createChain } from '../util/retrievalChain.js';
import { createAgentChain } from '../util/agentChain.js';
import { model } from '../util/model.js';
import { searchVectorStore } from '../lib/AI/searchVectorMongoDb.js';


const router = express.Router();

dotenv.config();
const chatHistory = [];

router.get('/', (req, res) => {
    res.send(`Hello, this is the Faithpal Ai Route make sure your key is in the .env`);
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
        });

        questions.push(QA);

        const checkData = await sourceKnowledge.create({ question: QA.question, answer: QA.answer });

        console.dir(checkData);

        let existingQuestions = [];

        try {
            const fileData = await fs.promises.readFile("question.json", "utf-8");
            existingQuestions = JSON.parse(fileData);
        } catch (err) {
            if (err.code !== 'ENOENT') {
                console.error("Error reading existing data from file:", err);
            }
        }

        const mergedQuestions = existingQuestions.concat(questions);

        await fs.promises.writeFile("question.json", JSON.stringify(mergedQuestions, null, 2));
        console.log("Successfully written data to file");

        res.status(201).json({ response: checkData, message: "Scraping completed successfully!" });
        
    } catch (err) {

        console.error(err);
        res.status(500).send("Internal Server Error");

    }
});

router.post('/create/vector', async (req, res) => {

    try {
        const client = new MongoClient(`${process.env.MONGODB_URI}`);

        const vectorStore = await createVectoreStore(client);

        console.log(vectorStore);

        res.status(200).json({ vectorStore, message: "Success" });

    } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
    }
});

router.post('/input', async (req, res) => {

    const { input } = req.body;

    try {
        //const prompt = toString(input);

        const client = new MongoClient(process.env.MONGODB_URI);

        const vectorData = await searchVectorStore(client);
        
        const chain = await createChain(vectorData);

        const response = await chain.invoke({ input: input, chat_history:chatHistory});

        console.log(response);
        chatHistory.push(new HumanMessage(input));
        chatHistory.push(new AIMessage(response.answer));

        res.status(200).json({ response: response.answer , message: "Success" });

    } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
    }
});

export default router;
