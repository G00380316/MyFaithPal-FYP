import dotenv from "dotenv";

//read Terminal
import readline from 'readline';

//AI LangChain
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { MessagesPlaceholder } from '@langchain/core/prompts';
import { createOpenAIFunctionsAgent, AgentExecutor } from 'langchain/agents';
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { createRetrieverTool } from "langchain/tools/retriever";
import { MongoClient } from "mongodb";
import { searchVectorStore } from "./lib/AI/searchVectorMongoDB.js";
import ChatHistory from "./models/llmHistory.js";
import { connectMongoDB } from "./lib/AI/mongo.js";

    dotenv.config();

    const client = new MongoClient(`${process.env.MONGODB_URI}`);
    
    //creating our model
    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0.7, // how accurate AI or creative
        maxTokens: 100,
        //verbose: true, // for testing AI
    });

    // Prompt Template
    const prompt = ChatPromptTemplate.fromMessages([
        ("system", "I am a pastor and my name is Job."),
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

    const aichatroom = "65eb4dbd53ff36d9c3fcb706";

    connectMongoDB();
    const chatHistory = await ChatHistory.findOne({ aichatroom });
    const storeChatHistory = [];

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

    const askQuestion = () => {
        rl.question("User: ", async (input) => {

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
            askQuestion()
        });
    };

askQuestion();