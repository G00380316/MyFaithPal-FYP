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
        temperature: 0.5, // how accurate AI or creative
        maxTokens: 100,
        //verbose: true, // for testing AI
    });

    // Prompt Template
    const prompt = ChatPromptTemplate.fromMessages([
        ("system", "You are a helpful assistant."),
        new MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
        new MessagesPlaceholder("agent_scratchpad"),
        ("{tool-output}",  // Placeholder for potential tool output
        // Conditionally create and use retrieverTool
        "{{#if hasRetrieverTool}} **Use the {{retrieverTool}} tool to enhance my response.** {{retrieverTool.output}} {{/if}}"),
        ("human","{input}")
         // Always use searchTool for broader information retrieval
        //("{tool-output}", "**I searched the web using the Search tool to find relevant information.** {{searchTool.output}}"),
    ]);

    /*
    const prompt = ChatPromptTemplate.fromMessages([
    ("ai", "You are a helpful friend and assistant named Solomon. I can answer questions only related to the Bible or Christianity, referencing these topics in my responses."),
    new MessagesPlaceholder("chat_history"),
    ("human", "{input}"),
    new MessagesPlaceholder("agent_scratchpad"),
    // Use the LLM directly if retrieval tools have no output
    ("{tool-output}", `{{#if (retrieverTool.output)}}
        **I found some relevant information from gotQuestions.org:** {{retrieverTool.output}}
        {{else}}
            {{#if input}}
            **Based on my knowledge of the Bible and Christianity, here's what I can tell you:** {{input}}
            {{else}}
            I need more information to understand your question. Can you rephrase it?
            {{/if}}
            {{#unless retrieverTool.output}}
            **I couldn't find anything directly related to your question in my religious texts. Would you like me to search the web using the Search tool?** 
            {{/unless}}
        {{/if}}`),
    ]);*/

    /*
    const prompt = ChatPromptTemplate.fromMessages([
        ("system", "You are a helpful assistant."),
        new MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
        new MessagesPlaceholder("agent_scratchpad"),
    ]);*/
    
    /*
    const prompt = ChatPromptTemplate.fromMessages([
        ("system", "You are a helpful assistant, focusing on religious topics."),
        new MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
        new MessagesPlaceholder("agent_scratchpad"),

        // Conditionally use retrieverTool for religious questions
        ("{tool-output}",
            "{{#if isReligiousQuestion(input)}} **I consulted religious texts using the Retriever tool to enhance my response.** {{retrieverTool.output}} {{/if}}"),

        // Always use searchTool for broader information retrieval
        ("{tool-output}", "**I searched the web using the Search tool to find relevant information.** {{searchTool.output}}"),
    ]);*/

    //Create and Assign Tools
    const searchTool = new TavilySearchResults();

    // User Input
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const aichatroom = process.env.AI_TEST_CHATROOM;

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
            //Working really well implementing for app
            const retriever = await vectorStore.asRetriever({
                k: 1,
                vectorStore,
                verbose: true
            });

            //console.log(retriever)
            
            const retrieverTool = createRetrieverTool(retriever, {
                name: "Retriever",
                description: "Use this tool when looking for answers you don't know or religion based questions",
                document_prompt: "{input}"
            });

            const tools = [retrieverTool, /*searchTool*/];

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