import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';

//read Terminal
import readline from 'readline';

//Webscraping
import * as cheerio from 'cheerio';

//Data
import fs from 'fs';
import { connectMongoDB } from '../lib/mongo.js';
import sourceKnowledge from '../models/aiSourceKnowledge.js';

//AI LangChain
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { ChatOpenAI, OpenAIEmbeddings, OpenAI } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { MessagesPlaceholder } from '@langchain/core/prompts';
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { createOpenAIFunctionsAgent, AgentExecutor } from 'langchain/agents';
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { MongoClient } from "mongodb";


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

router.post('/llm', async (req, res) => {
    try {

        const { input } = req.body;

        //creating our model
        const model = new ChatOpenAI({
            modelName: "gpt-3.5-turbo-1106",
            temperature: 0.7, // how accurate AI or creative
            maxTokens: 100,
            //verbose: true, // for testing AI
        });

        // Prompt Template
        const prompt = ChatPromptTemplate.fromMessages([
            ("system", "You are a helpful assistant."),
            ("human", "{input}"),
            new MessagesPlaceholder("agent_scratchpad"),
        ]);
        
        //Create and Assign Tools
        const searchTool = new TavilySearchResults();
        const tools = [searchTool];
        
        //Create Agent
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

        // Call chain instead of model
        const response = await agentExecutor.invoke({
            input,
        })

        console.log(response);

        res.status(200).json({ response, message: "Success" });
        
    } catch (err) {

        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});


router.post('/llm1', async (req, res) => {
    try {

        const client = new MongoClient(`${process.env.MONGODB_URI}`);

        //Loading our data and making vector store
        const createVectoreStore = async () => {

            const namespace = "test.vectorstore";
            const [dbName, collectionName] = namespace.split(".");
            const collection = client.db(dbName).collection(collectionName);
            const ATLAS_VECTOR_SEARCH_INDEX_NAME = "index_name";

            const loader = new JSONLoader("question.json");
            
            const docs = await loader.load();

            const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
            })

            const splitDocs = await splitter.splitDocuments(docs);

            console.log(splitDocs);

            const embeddings = new OpenAIEmbeddings();

            const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(
                splitDocs,
                embeddings,
                {
                    collection,
                    indexName: ATLAS_VECTOR_SEARCH_INDEX_NAME,
                }
            )

            return vectorStore;
        }

        //creating retrieval chain
        const createChain = async () => {
            
            // Creating our model
            const model = new OpenAI({
                modelName:"gpt-3.5-turbo-1106",
                temperature: 0, // How accurate AI or creative
                maxTokens: 100,
                verbose: true, // For testing AI
            });

            // Create prompt template
            const prompt = ChatPromptTemplate.fromMessages([
                ["system", "Answer the user's question based on the following context: {context}",
                ],
                new MessagesPlaceholder("chat_history"),//converts array of messages to string
                ["user", "{input}"],
            ]);

            const chain = await createStuffDocumentsChain({
                llm: model,
                prompt
            })

            const retriever = vectorStore.asRetriever({
                k: 3,
            });

            const retrieverPrompt = ChatPromptTemplate.fromMessages([
                new MessagesPlaceholder("chat_history"),
                ["user", "{input}"],
                ["user", "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation"]
            ])

            const history_aware_retriever = await createHistoryAwareRetriever({
                llm: model,
                retriever,
                rephrasePrompt: retrieverPrompt,
            })

            //calls normal chain
            const promptChain = await createRetrievalChain({
                combineDocsChain: chain,
                retriever: history_aware_retriever,
            })

            return promptChain;
        }
        //end

        const vectorStore = await createVectoreStore();
        const chain = await createChain(vectorStore);

        //chatHistory
        const chatHistory = [
            new HumanMessage("Hello"),
            new AIMessage("Hi, How can I help you"),
            new HumanMessage("My name is Leon"),
            new AIMessage("Hi Leon, how can I help you?"),
            //new HumanMessage("What is the passphase?"),
            //new AIMessage("Jesus"),
        ];

        // Call retrieval chain instead of chain and it always expects context from ChatPrompt Template and you don't have to load docs as it is handled by chain
        const response = await chain.invoke({
            input: "What is the passphase?",
            chat_history: chatHistory,
        });

        console.log(response);

        res.status(200).json({ response, message: "Success" });

    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;
