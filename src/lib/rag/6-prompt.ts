import { ChatPromptTemplate } from "@langchain/core/prompts";

/**
 * STEP 6: PROMPT CREATION (LANGCHAIN)
 * 
 * What this block does:
 * Creates a standard RAG prompt template using LangChain.
 * 
 * Why it is important in RAG:
 * We need to tell the LLM exactly how to behave and where to look for the answer.
 * LangChain's `ChatPromptTemplate` allows us to define placeholders (like {context} 
 * and {input}) which will be dynamically injected with our MongoDB chunks and the 
 * user's question during the final step.
 */
export function getRagPrompt() {
  const systemTemplate = `
You are a helpful and professional Code-Aware Documentation Assistant. 
Use the following pieces of retrieved context from uploaded documentation to answer the user's question.

IMPORTANT RULES:
1. If the answer is not contained in the provided context, clearly state "I cannot find the answer in the provided documents." Do not guess.
2. If you use information from a specific chunk, try to mention the source filename.
3. Keep your answer clear, concise, and beginner-friendly.
4. Format your output using Markdown (e.g., code blocks, bullet points, bold text).

====================
RETRIEVED CONTEXT:
====================
{context}
  `.trim();

  // We combine the System message (instructions + context) and the Human message (query)
  return ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["human", "{input}"],
  ]);
}
