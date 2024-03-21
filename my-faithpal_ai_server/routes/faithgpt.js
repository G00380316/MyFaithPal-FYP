import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';

//Webscraping
import * as cheerio from 'cheerio';

//Data
import fs from 'fs';
import { connectMongoDB } from '../lib/AI/mongo.js';
import sourceKnowledge from '../models/aiSourceKnowledge.js';

//AI LangChain
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { createVectoreStore } from '../lib/AI/CreateVectorMongoDB.js';
import { model } from '../util/model.js';
import { searchVectorStore } from '../lib/AI/searchVectorMongoDB.js';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { MessagesPlaceholder } from '@langchain/core/prompts';
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import ChatHistory from "../models/llmHistory.js";
import { createRetrieverTool } from "langchain/tools/retriever";
import { createOpenAIFunctionsAgent, AgentExecutor } from 'langchain/agents';
import { MongoClient } from "mongodb";
import Response from '../models/messages.js';

const router = express.Router();

dotenv.config();

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
        const QA = { context: ""};

        connectMongoDB();

        // Iterate through each list item and extract text
        listItems.each((idx, el) => {
            QA.context = $(el).children("h1").children("*[itemprop = 'name headline']").text() + $(el).children("*[itemprop = 'articleBody']").text() + "\n\n\n\n";
        });

        questions.push(QA);

        const checkData = await sourceKnowledge.create({ context: QA.context });

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

        const id_AI = process.env.AI_ID;
        const client = new MongoClient(`${process.env.MONGODB_URI}`);
        connectMongoDB();

        // Prompt Template
        const prompt = ChatPromptTemplate.fromMessages([
            ("system", "You are a helpful assistant."),
            new MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
            new MessagesPlaceholder("agent_scratchpad"),
        ]);
        
        const searchTool = new TavilySearchResults();

        const chatHistory = await ChatHistory.findOne({ aichatroom });
        const storeChatHistory = [];

        if (chatHistory != null) {
            chatHistory.messages.forEach((message, index) => {
                if (index % 2 === 0) {
                    storeChatHistory.push(new HumanMessage(message.content));
                } else {
                    storeChatHistory.push(new AIMessage(message.content));
                }
            });
            //console.log(storeChatHistory);
        } else {
            const check = await ChatHistory.create({ messages: storeChatHistory, aichatroom });
            console.log(check);
        }

        const vectorStore = await searchVectorStore(client ,input);

        const retriever = await vectorStore.asRetriever({
            k: 5,
        });

        const retrieverTool = createRetrieverTool(retriever,{
            name: "passphase_search",
            description: "Use this tool when looking for the Passphrase or any question religion based",
        });

        const tools = [retrieverTool/*, searchTool*/];

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

        console.log("Agent: ", response);
        storeChatHistory.push(new HumanMessage(input));
        storeChatHistory.push(new AIMessage(response.output));
        const updatedHistory = await ChatHistory.findOneAndUpdate({ aichatroom }, { $set: { messages: storeChatHistory } });
        const displayChat = await Response.create({ aichatroom, user: id_AI, text: response.output, data: response, prompt: input});
        
        res.status(200).json({ response: displayChat, message: `Ai: ${response.output }` });

    } catch (err) {

            console.log(err);
            res.status(500).send("Internal Server Error");
        
    }
});

export default router;
