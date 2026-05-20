// @ts-ignore - TS complains about no default export, but this is required for Vercel's bundler
import pdfParse from "pdf-parse";
import { Document } from "@langchain/core/documents";

/**
 * STEP 1: DOCUMENT INGESTION (LANGCHAIN)
 * 
 * What this block does:
 * Uses LangChain's document loaders to parse uploaded files (PDF, TXT, MD) 
 * into LangChain "Document" objects.
 * 
 * Why it is important in RAG:
 * LangChain provides standard interfaces for reading from any source. 
 * By converting raw files into LangChain Documents, we can seamlessly pass them 
 * to the next steps (chunking, embedding).
 * 
 * Input -> Output flow:
 * File (Blob) -> Array of LangChain Documents (Metadata + pageContent)
 */
export async function extractTextFromFile(file: File): Promise<Document[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Safely convert ArrayBuffer to Node.js Buffer for Vercel compatibility
    const buffer = Buffer.from(arrayBuffer);
    
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const pdfData = await pdfParse(buffer);
      if (!pdfData || !pdfData.text) {
        throw new Error("Failed to extract text from the PDF.");
      }
      return [new Document({ pageContent: pdfData.text, metadata: { source: file.name } })];
    }

    if (
      file.type === "text/plain" ||
      file.type === "text/markdown" ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".md") ||
      file.name.endsWith(".csv")
    ) {
      const text = buffer.toString("utf-8");
      if (!text || !text.trim()) {
        throw new Error("The uploaded text file is empty.");
      }
      return [new Document({ pageContent: text, metadata: { source: file.name } })];
    }

    throw new Error(
      `Unsupported file type: ${file.type || file.name}. Please upload a PDF, TXT, or MD file.`
    );
  } catch (error: any) {
    console.error("Error in extractTextFromFile:", error);
    throw new Error(`Ingestion failed: ${error.message}`);
  }
}
