import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { createOpenAIFunctionsAgent, AgentExecutor } from 'langchain/agents';
import { createRetrieverTool } from "langchain/tools/retriever";
import { model } from "./model.js";

export const createAgentChain = async (retriever , prompt) => {

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

    return agentExecutor;
}


