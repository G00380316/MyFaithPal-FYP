import dotenv from "dotenv";

//read Terminal
import readline from 'readline';

//AI LangChain
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { createRetrieverTool } from "langchain/tools/retriever";
import { MongoClient } from "mongodb";
import { connectMongoDB } from "./lib/AI/mongo.js";
import { searchVectorStore } from "./lib/AI/searchVectorMongoDB.js";
import ChatHistory from "./models/llmHistory.js";

    dotenv.config();

    const client = new MongoClient(`${process.env.MONGODB_URI}`);
    
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
        new MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
        new MessagesPlaceholder("agent_scratchpad"),
    ]);
    
    //Create and Assign Tools
    const searchTool = new TavilySearchResults();

    // User Input
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const aichatroom = "65eb4dbd53ff36d9c3fcb707";

    connectMongoDB();
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
            //console.log(check);
    }

    const askQuestion = () => {
        rl.question("User: ", async (input) => {

            connectMongoDB();

            if (input.toLowerCase() === "exit") {
                rl.close();
                return;
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

            // Call Agent
            const response = await agentExecutor.invoke({
                input: input,
                chat_history: storeChatHistory,
            });

            //console.log("Agent: ", response.output);
            storeChatHistory.push(new HumanMessage(input));
            storeChatHistory.push(new AIMessage(response.output));
            const updatedHistory = await ChatHistory.findOneAndUpdate({ aichatroom }, { $set: { messages: storeChatHistory } });
            
            ////console.log(updatedHistory);

            askQuestion()
        });
    };

askQuestion();