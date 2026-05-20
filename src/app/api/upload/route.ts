import { NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/rag/1-ingestion";
import { chunkDocuments } from "@/lib/rag/2-chunking";
import { storeDocumentsInVectorDB } from "@/lib/rag/4-vectorStore";

export const maxDuration = 60; // Allows Vercel to run up to 60s (fixes timeout)

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ==========================================
    // THE RAG PIPELINE: INGESTION TO DATABASE
    // ==========================================

    // 1. Ingestion: Extract raw text from the uploaded file into LangChain Documents
    console.log(`Extracting text from ${file.name}...`);
    const loadedDocs = await extractTextFromFile(file);

    // 2. Chunking: Split the documents into smaller segments using LangChain's splitter
    console.log("Chunking documents...");
    const chunkedDocs = await chunkDocuments(loadedDocs);
    console.log(`Created ${chunkedDocs.length} chunks.`);

    // 3 & 4. Embeddings & Storage: Embed the chunks and store them in MongoDB Atlas
    console.log("Generating embeddings and saving to MongoDB Atlas...");
    await storeDocumentsInVectorDB(chunkedDocs);

    return NextResponse.json({ 
      message: "File successfully processed and saved to MongoDB Atlas!" 
    });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process file" }, 
      { status: 500 }
    );
  }
}
