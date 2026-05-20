import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";

/**
 * STEP 2: CHUNKING (LANGCHAIN)
 * 
 * What this block does:
 * Takes the large loaded documents and splits them into smaller, manageable chunks 
 * using LangChain's smart splitting algorithm.
 * 
 * Why it is important in RAG:
 * LangChain's `RecursiveCharacterTextSplitter` is standard in the industry. It tries 
 * to split on paragraphs first, then sentences, then words, keeping related concepts 
 * together much better than a simple character count.
 * 
 * Input -> Output flow:
 * Array of Large Documents -> Array of Smaller Document Chunks
 */
export async function chunkDocuments(docs: Document[]): Promise<Document[]> {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  // splitDocuments automatically maps over the array and preserves metadata
  const chunkedDocs = await textSplitter.splitDocuments(docs);
  return chunkedDocs;
}
