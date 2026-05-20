import { NextResponse } from "next/server";
import { getAnswerFromRAG } from "@/lib/rag/7-llm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    // ==========================================
    // THE RAG PIPELINE: CHAT & RETRIEVAL
    // ==========================================

    // The LangChain Retrieval Chain handles everything for us: 
    // Embedding the query, searching MongoDB, building the prompt, and calling Gemini!
    const result = await getAnswerFromRAG(message);

    // Return the answer and the source chunks to the frontend
    return NextResponse.json({
      answer: result.answer,
      sources: result.sourceDocuments.map(doc => ({
        source: doc.metadata.source || "Unknown",
        text: doc.pageContent,
        // LangChain's default retriever doesn't expose raw similarity scores by default, 
        // so we omit it or return 1.
        similarity: 1 
      }))
    });

  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process chat message" }, 
      { status: 500 }
    );
  }
}
