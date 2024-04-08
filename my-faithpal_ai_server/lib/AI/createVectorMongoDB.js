import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

//Loading our data and making vector store
export const createVectoreStore = async (client) => {

            //delete the collection to create a new vector store from json
            const namespace = process.env.COLLECTION_NAMESPACE;
            const [dbName, collectionName] = namespace.split(".");
            const collection = client.db(dbName).collection(collectionName);

            /* If you want to load directly from database
            //const response = await axios.post(`${process.env.SERVER_URL}/faithpalAI/load/json`);

            ////console.log(response.data)
    
            //const context = new Blob([JSON.stringify(response.data)], { type: 'application/json' });

            //const loader = new JSONLoader(context);*/

            //WARNING RUN JSON FIX BEFORE CREATING VECTOR

            await collection.deleteMany({});

            const loader = new JSONLoader("question.json");

            const docs = await loader.load();

            const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 5000, chunkOverlap: 0, separators: ["\n\n\n\n"],
            })

            const splitDocs = await splitter.splitDocuments(docs);

            const embeddings = new OpenAIEmbeddings();

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
