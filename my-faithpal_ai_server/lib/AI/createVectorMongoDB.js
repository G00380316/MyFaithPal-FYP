import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from "@langchain/openai";

//Loading our data and making vector store
export const createVectoreStore = async (client) => {

            const namespace = "test.vectorstore";
            const [dbName, collectionName] = namespace.split(".");
            const collection = client.db(dbName).collection(collectionName);

            const loader = new JSONLoader("question.json");
            
            const docs = await loader.load();

            const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000, chunkOverlap: 0, separators: ["\n\n\n\n"],
            })

            const splitDocs = await splitter.splitDocuments(docs);

            const embeddings = new OpenAIEmbeddings();
    
            collection.deleteMany({});

            const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(
                splitDocs,
                embeddings,
                {
                    collection,
                    indexName: process.env.INDEX_NAME,
                }
            )

            return vectorStore;
}
