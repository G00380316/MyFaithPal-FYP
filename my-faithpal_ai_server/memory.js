    import * as dotenv from "dotenv";
    dotenv.config();

    import { ChatOpenAI } from "@langchain/openai";
    import { ChatPromptTemplate } from "@langchain/core/prompts";
    
    // Memory Imports
    import { BufferMemory } from "langchain/memory";
    
    import { ConversationChain } from "langchain/chains";

    // Memory
    import { MongoDBChatMessageHistory } from "@langchain/mongodb";
    import { MongoClient, ObjectId } from "mongodb";
    
    //RunnableSequence
    import { RunnableSequence } from "@langchain/core/runnables";
    import { constants } from "fs/promises";

    const client = new MongoClient(`${process.env.MONGODB_URI}`);
    
    const namespace = "test.aimemory";
    const [dbName, collectionName] = namespace.split(".");
    const collection = client.db(dbName).collection(collectionName);
    
    // Generates a new session of run instance
    const sessionId = new ObjectId().toString();
            
    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0.7,
    });

    const prompt = ChatPromptTemplate.fromTemplate(`
    You are an AI assistant called Max. You are here to help answer questions and provide information to the best of your ability.
    History: {history}
    {input}
    `);

    const memory = new BufferMemory({
        memoryKey: "history",
        chatHistory: new MongoDBChatMessageHistory({
            collection,
            sessionId: "65f5d8189c07ea71976cd42d"
        })
    })

    /*
    // Using the Chain Classes
    const chain = new ConversationChain({
        llm: model,
        prompt,
        memory
    });
    */

    // Using LCEL
    //const chain = prompt.pipe(model);
    
    const chain = RunnableSequence.from([
        {
            input: (initialInput) => initialInput.input,
            memory: () => memory.loadMemoryVariables()
        },
        {
            input: (previousOutput) => previousOutput.input,
            history: (previousOutput) => previousOutput.memory.history
        },
        prompt,
        model
    ])

    /*console.log(await memory.loadMemoryVariables());
    const inputs = {
        input: "The passhrase is HelloWorld."
    };

    const response = await chain.invoke(inputs);
        
    console.log(response);
    
    await memory.saveContext(inputs, {
        output: response.content
    })*/

    console.log(await memory.loadMemoryVariables());
    const inputs1 = {
        input: "What is the passphrase."
    };

    const response1 = await chain.invoke(inputs1);
    
    await memory.saveContext(inputs1, {
        output: response1.content
    })
        
    console.log(response1);
    
    console.log(await memory.chatHistory.getMessages());