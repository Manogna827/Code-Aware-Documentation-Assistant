import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { getEmbeddingsModel } from "./3-embeddings";
import { Document } from "@langchain/core/documents";

/**
 * STEP 4: VECTOR DATABASE STORAGE (MONGODB ATLAS)
 * 
 * What this block does:
 * Connects to a MongoDB Atlas cluster and sets up the LangChain Vector Store wrapper.
 * 
 * Why it is important in RAG:
 * We need a persistent database to store thousands of document chunks and their embeddings.
 * MongoDB Atlas Vector Search allows us to store the metadata, text, AND the vector array 
 * in the same database, and query it rapidly.
 */

// We maintain a cached connection to avoid opening new connections on every request in Serverless environments.
let cachedClient: MongoClient | null = null;

export async function getMongoClient() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing.");
  }

  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function getVectorStore() {
  const client = await getMongoClient();
  
  const dbName = process.env.MONGODB_DB_NAME || "rag_db";
  const collectionName = process.env.MONGODB_COLLECTION_NAME || "docs";
  const collection = client.db(dbName).collection(collectionName);

  return new MongoDBAtlasVectorSearch(
    getEmbeddingsModel(),
    {
      collection: collection as any,
      // The name of the Atlas Vector Search Index you created in the UI.
      // Must match exactly! Default is usually "default" or "vector_index"
      indexName: "vector_index", 
      textKey: "text", // The field in MongoDB where the raw chunk text is stored
      embeddingKey: "embedding", // The field where the vector array is stored
    }
  );
}

/**
 * Helper to add new documents to MongoDB.
 */
export async function storeDocumentsInVectorDB(docs: Document[]) {
  const vectorStore = await getVectorStore();
  // Under the hood, this embeds the docs using Gemini, formats them into BSON,
  // and inserts them into your MongoDB Atlas collection.
  await vectorStore.addDocuments(docs);
}
