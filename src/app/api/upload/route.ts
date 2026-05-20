import { NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/rag/1-ingestion";
import { chunkDocuments } from "@/lib/rag/2-chunking";
import { storeDocumentsInVectorDB } from "@/lib/rag/4-vectorStore";

export const maxDuration = 60; // Allows Vercel to run up to 60s
export const runtime = "nodejs"; // Force Node.js runtime (fixes Edge/Buffer/fs issues)
export const dynamic = "force-dynamic"; // Prevent static caching of the upload route

export async function POST(request: Request) {
  try {
    // 1. Ensure the request has a body before trying to parse
    if (!request.body) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }

    // 2. Safely parse FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided in the request" }, { status: 400 });
    }

    // ==========================================
    // THE RAG PIPELINE: INGESTION TO DATABASE
    // ==========================================

    console.log(`Extracting text from ${file.name}...`);
    const loadedDocs = await extractTextFromFile(file);

    console.log("Chunking documents...");
    const chunkedDocs = await chunkDocuments(loadedDocs);
    console.log(`Created ${chunkedDocs.length} chunks.`);

    console.log("Generating embeddings and saving to MongoDB Atlas...");
    await storeDocumentsInVectorDB(chunkedDocs);

    return NextResponse.json({ 
      message: "File successfully processed and saved to MongoDB Atlas!" 
    });

  } catch (error: any) {
    console.error("API Route Upload Error:", error);
    
    // Explicitly return JSON so the frontend NEVER gets an HTML 500 page
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during processing." }, 
      { status: 500 }
    );
  }
}
