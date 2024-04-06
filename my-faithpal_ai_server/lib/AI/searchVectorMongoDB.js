import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";

//Loading our data and making vector store
export const searchVectorStore = async (client, input) => {

            const query = toString(input);

            const namespace = "test.aisknowledges";
            const [dbName, collectionName] = namespace.split(".");
            const collection = client.db(dbName).collection(collectionName);
            
            const embeddings = new OpenAIEmbeddings();
    
            const vectorStore = new MongoDBAtlasVectorSearch(
                embeddings,
                {
                    collection,
                    indexName: process.env.INDEX_NAME,
                }
            )
    
            //const result = await vectorStore.maxMarginalRelevanceSearch(query, {
               // k: 5,
            // });
            //works better
            //const retrieverOutput = await vectorStore.similaritySearch(query, 5);
            //console.log (result)

            return vectorStore;
}
