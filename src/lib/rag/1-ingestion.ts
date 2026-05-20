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
  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: file.type });
  
  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    const pdfData = await pdfParse(Buffer.from(arrayBuffer));
    return [new Document({ pageContent: pdfData.text, metadata: { source: file.name } })];
  }

  if (
    file.type === "text/plain" ||
    file.type === "text/markdown" ||
    file.name.endsWith(".txt") ||
    file.name.endsWith(".md") ||
    file.name.endsWith(".csv")
  ) {
    const text = Buffer.from(arrayBuffer).toString("utf-8");
    return [new Document({ pageContent: text, metadata: { source: file.name } })];
  }

  throw new Error(
    "Unsupported file type. Please upload a PDF, TXT, or MD file."
  );
}
