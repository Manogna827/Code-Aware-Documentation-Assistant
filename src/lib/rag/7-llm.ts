import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { getRetriever } from "./5-retriever";
import { getRagPrompt } from "./6-prompt";

/**
 * STEP 7: LLM ANSWER GENERATION (LANGCHAIN)
 * 
 * What this block does:
 * Wires the Retriever, the Prompt, and the Google Gemini LLM into a single execution.
 */

export async function getAnswerFromRAG(question: string) {
  // 1. Initialize the LLM
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash", 
    temperature: 0.1, 
  });

  // 2. Get the Retriever (Step 5) and Prompt (Step 6)
  const retriever = await getRetriever(3);
  const prompt = getRagPrompt();

  // 3. Execute the pipeline!
  console.log(`Executing LangChain RAG pipeline for query: "${question}"...`);
  
  // a) Retrieve the relevant documents from MongoDB
  const sourceDocuments = await retriever.invoke(question);
  
  // b) Format the documents into a single string
  const context = sourceDocuments.map((doc, idx) => `[Source: ${doc.metadata.source || "Unknown"} | Chunk ${idx + 1}]\n${doc.pageContent}`).join("\n\n---\n\n");
  
  // c) Build the final prompt using the context and user question
  const formattedPrompt = await prompt.invoke({
    context: context,
    input: question,
  });
  
  // d) Send to Gemini!
  const response = await llm.invoke(formattedPrompt);

  return {
    answer: response.content as string,
    sourceDocuments: sourceDocuments, 
  };
}
