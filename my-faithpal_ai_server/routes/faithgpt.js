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
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { createRetrieverTool } from "langchain/tools/retriever";
import { MongoClient } from "mongodb";
import { createVectoreStore } from '../lib/AI/createVectorMongoDB.js';
import { searchVectorStore } from '../lib/AI/searchVectorMongoDB.js';
import AISKnowledge from '../models/aiSourceKnowledge.js';
import ChatHistory from "../models/llmHistory.js";
import Response from '../models/messages.js';
import { model } from '../util/model.js';

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

        let text;

        connectMongoDB();

        // Iterate through each list item and extract text
        listItems.each((idx, el) => {
            text = $(el).children("h1").children("*[itemprop = 'name headline']").text() + $(el).children("*[itemprop = 'articleBody']").text() + "\n\n\n\n";
        });

        const checkData = await sourceKnowledge.create({ text: text });

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

        //console.log(vectorStore);

        res.status(200).json({ vectorStore, message: "Success" });

    } catch (err) {
            //console.log(err);
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
            ("ai", "You are a helpful friend and assistant and your name is Solomon, Answer questions only related to the Bible or Christianity and Answer referring to Bible and Christianity"),
            new MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
            new MessagesPlaceholder("agent_scratchpad"),
            ("{tool-output}","{{#if hasRetrieverTool}} **Use the {{retrieverTool}} tool to enhance my response.** {{retrieverTool.output}} {{/if}}"),
            ("human", "{input}"),
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
            ////console.log(storeChatHistory);
        } else {
            const check = await ChatHistory.create({ messages: storeChatHistory, aichatroom });
            //console.log(check);
        }

        const vectorStore = await searchVectorStore(client ,input);

        const retriever = await vectorStore.asRetriever({
            k: 3,
            vectorStore,
            verbose: true
        });

        const retrieverTool = createRetrieverTool(retriever, {
            name: "retriever",
            description: "use this tool",
            query: "{input}"
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

        //console.log("Agent: ", response.output);
        storeChatHistory.push(new HumanMessage(input));
        storeChatHistory.push(new AIMessage(response.output));
        const updatedHistory = await ChatHistory.findOneAndUpdate({ aichatroom }, { $set: { messages: storeChatHistory } });
        const displayChat = await Response.create({ aichatroom, user: id_AI, text: response.output, data: response, prompt: input});
        
        res.status(200).json({ response: displayChat, message: `Ai: ${response.output }` });

    } catch (err) {

            //console.log(err);
            res.status(500).send("Internal Server Error");
        
    }
});

router.post('/input/beta', async (req, res) => {

    const { input, aichatroom } = req.body;

    try {

        const id_AI = process.env.AI_ID;
        const client = new MongoClient(`${process.env.MONGODB_URI}`);
        connectMongoDB();

        // Prompt Template
        const prompt = ChatPromptTemplate.fromMessages([
            ("ai", "You are a helpful friend and assistant and your name is Solomon, Answer questions only related to the Bible or Christianity and Answer referring to Bible and Christianity"),
            new MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
            new MessagesPlaceholder("agent_scratchpad"),
            ("{tool-output}", "{{#if hasRetrieverTool}} **Use the {{retrieverTool}} tool to enhance my response.** {{retrieverTool.output}} {{/if}}"),
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
            ////console.log(storeChatHistory);
        } else {
            const check = await ChatHistory.create({ messages: storeChatHistory, aichatroom });
            //console.log(check);
        }

        const vectorStore = await searchVectorStore(client ,input);

        const retriever = await vectorStore.asRetriever({
            k: 1,
            vectorStore,
            //verbose: true
        });

        const retrieverTool = createRetrieverTool(retriever, {
            name: "retriever",
            description: "use this tool",
            query: "{input}"
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

        //console.log("Agent: ", response.output);
        storeChatHistory.push(new HumanMessage(input));
        storeChatHistory.push(new AIMessage(response.output));
        const updatedHistory = await ChatHistory.findOneAndUpdate({ aichatroom }, { $set: { messages: storeChatHistory } });
        const displayChat = await Response.create({ aichatroom, user: id_AI, text: response.output, data: response, prompt: input});
        
        res.status(200).json({ response: displayChat, message: `Ai: ${response.output }` });

    } catch (err) {

            //console.log(err);
            res.status(500).send("Internal Server Error");
        
    }
});

router.post('/fix/json', async (req, res) => {
    try {
        
        connectMongoDB();

        const loadData = await AISKnowledge.find();

        //console.log(loadData);
        const uniqueTexts = new Set();


        loadData.forEach(obj => uniqueTexts.add(obj.text));


        const FormattedData = [...uniqueTexts].map(text => ({ text }));

        ////console.log(FormattedData);

        await fs.promises.writeFile("question.json", JSON.stringify(FormattedData, null, 2));

        res.status(200).json({ response: FormattedData, message: "Json fixed successfully!" });
        
    } catch (err) {

        console.error(err);
        res.status(500).send("Internal Server Error");

    }
});

router.post('/load/json', async (req, res) => {
    try {
        
        connectMongoDB();

        let FormattedData = [];

        const loadData = await AISKnowledge.find();

        //console.log(loadData);

        loadData.forEach(obj => FormattedData.push({ text: obj.text }));

        res.status(200).json({ response: FormattedData, message: "Json sent successfully!" });
        
    } catch (err) {

        console.error(err);
        res.status(500).send("Internal Server Error");

    }
});

export default router;
