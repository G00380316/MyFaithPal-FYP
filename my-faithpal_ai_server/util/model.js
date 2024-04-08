//Model
import { ChatOpenAI, OpenAI } from "@langchain/openai";
//You can switch to ChatOpenAi for more conversational responses

// Creating our model
    export const model = new ChatOpenAI({
        modelName:"gpt-3.5-turbo-1106", // gpt-3.5-turbo or gpt-3.5-turbo-1106
        temperature: 0.5, // How accurate AI or creative
        maxTokens: 1000,
        verbose: true, // For testing AI
    });