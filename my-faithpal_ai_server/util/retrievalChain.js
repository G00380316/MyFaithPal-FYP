import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { createRetrievalChain } from "langchain/chains/retrieval";
import { MessagesPlaceholder } from '@langchain/core/prompts';
import { model } from "./model.js";

export const createChain = async ( vectorStore ) => {

    // Create prompt template
    const prompt = ChatPromptTemplate.fromMessages([
        ("system", "Answer the user's question based on the following context: {context}"),
        new MessagesPlaceholder("chat_history"),//converts array of messages to string
        ("user", "{input}"),
    ]);

    const chain = await createStuffDocumentsChain({
        llm: model,
        prompt
    })

    const retriever = await vectorStore.asRetriever({
        k: 5,
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
    const retrievalChain = await createRetrievalChain({
        combineDocsChain: chain,
        retriever: history_aware_retriever,
    })

    return retrievalChain;
}


