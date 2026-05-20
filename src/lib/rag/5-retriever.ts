import { getVectorStore } from "./4-vectorStore";

/**
 * STEP 5: VECTOR SEARCH / RETRIEVER (LANGCHAIN)
 * 
 * What this block does:
 * Configures a LangChain Retriever object pointing to our MongoDB Atlas collection.
 * 
 * Why it is important in RAG:
 * A Retriever is an interface that returns documents given an unstructured query. 
 * By calling `.asRetriever()`, LangChain abstracts away the raw MongoDB Vector Search 
 * syntax. When given a query, it will automatically embed the query, perform a similarity 
 * search in MongoDB, and return the top matching `Document` objects.
 */
export async function getRetriever(topK: number = 3) {
  const vectorStore = await getVectorStore();
  
  // Return the top K most similar chunks
  return vectorStore.asRetriever({
    k: topK,
    // You can also add metadata filters here if you want to search within a specific document!
  });
}
