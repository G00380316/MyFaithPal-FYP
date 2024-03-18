import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';

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
import { model } from '../util/model.js';
import { searchVectorStore } from '../lib/AI/searchVectorMongoDB.js';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { MessagesPlaceholder } from '@langchain/core/prompts';
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import ChatHistory from "../models/llmHistory.js";
import { createRetrieverTool } from "langchain/tools/retriever";
import { createOpenAIFunctionsAgent, AgentExecutor } from 'langchain/agents';

const router = express.Router();

dotenv.config();
const storeChatHistory = [];

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

    const { input, aichatroom } = req.body;

    try {

        const client = new MongoClient(`${process.env.MONGODB_URI}`);

        // Prompt Template
        const prompt = ChatPromptTemplate.fromMessages([
            ("system", "I am a pastor and my name is Job."),
            new MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
            new MessagesPlaceholder("agent_scratchpad"),
        ]);
        
        const searchTool = new TavilySearchResults();

        connectMongoDB();
        const chatHistory = await ChatHistory.findOne({ aichatroom });

        if (chatHistory != null && storeChatHistory == null) {
            for (let i = 0; i < chatHistory.messages.length; i++) {
                    if (chatHistory.messages[i] % 2 === 0) {
                        storeChatHistory.push(new HumanMessage(chatHistory.messages[i].content));
                    }
                    else {
                        storeChatHistory.push(new AIMessage(chatHistory.messages[i].content));
                    }
                }
        }

        const vectorStore = await searchVectorStore(client, input);

        const retriever = await vectorStore.asRetriever({
            k: 5,
        });

        const retrieverTool = createRetrieverTool(retriever,{
            name: "passphase_search",
            description: "Use this tool when looking for the Passphase",
        });

        const tools = [retrieverTool, searchTool];

        const agent = await createOpenAIFunctionsAgent({
            llm: model,
            prompt,
            tools,
        });

        // Create the executor
        const agentExecutor = new AgentExecutor({
            agent,
            tools,
        });

        // Call Agent
        const response = await agentExecutor.invoke({
            input: input,
            chat_history: storeChatHistory,
        });

        connectMongoDB();
        console.log("Agent: ", response.output);
        storeChatHistory.push(new HumanMessage(input));
        storeChatHistory.push(new AIMessage(response.output));
        const check = await ChatHistory.findOne({ aichatroom });
        if (check == null) {
            await ChatHistory.create({ messages: storeChatHistory , aichatroom });
        }
        else {
            await ChatHistory.updateOne({ messages: storeChatHistory, aichatroom });
        }

        res.status(200).json({ response: response.output , message: "Success" });

    } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
    }
});

export default router;
