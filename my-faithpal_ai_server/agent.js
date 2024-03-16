import dotenv from "dotenv";

//read Terminal
import readline from 'readline';

//AI LangChain
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { ChatOpenAI, OpenAIEmbeddings, OpenAI } from "@langchain/openai";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { MessagesPlaceholder } from '@langchain/core/prompts';
import { createOpenAIFunctionsAgent, AgentExecutor } from 'langchain/agents';
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { createRetrieverTool } from "langchain/tools/retriever";
import { MongoClient } from "mongodb";

    dotenv.config();

    const client = new MongoClient(`${process.env.MONGODB_URI}`);
    
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

    const retriever = vectorStore.asRetriever({
        k: 3,
    });


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
    const retrieverTool = createRetrieverTool(retriever,{
        name: "passphase_search",
        description: "Use this tool when looking for the Passphase",
    });
    const tools = [searchTool, retrieverTool];
    
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

    // User Input
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const chatHistory = [];

    const askQuestion = () => {
        rl.question("User: ", async (input) => {

            if (input.toLowerCase() === "exit") {
                rl.close();
                return;
            }

            // Call Agent
            const response = await agentExecutor.invoke({
                input: input,
                chat_history: chatHistory,
            });

            console.log("Agent: ", response.output);
            chatHistory.push(new HumanMessage(input));
            chatHistory.push(new AIMessage(response.output))
            askQuestion()
        });
    };

askQuestion();