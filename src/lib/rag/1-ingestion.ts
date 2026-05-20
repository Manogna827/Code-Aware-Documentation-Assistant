import { Document } from "@langchain/core/documents";

/**
 * STEP 1: DOCUMENT INGESTION (LANGCHAIN)
 * 
 * What this block does:
 * Takes uploaded files such as TXT, MD, and CSV files, reads their contents,
 * and converts them into LangChain Document objects.
 * 
 * Why it is important in RAG:
 * LangChain uses Document objects as the standard format for passing data
 * through the RAG pipeline. By converting raw files into structured Documents,
 * we can easily perform chunking, embedding generation, and vector storage.
 * 
 * This step is responsible for:
 * - Reading uploaded files
 * - Extracting text content
 * - Adding useful metadata (like file name)
 * - Preparing data for chunking
 * 
 * Input -> Output flow:
 * Uploaded File (TXT / MD / CSV)
 *            ↓
 * Array of LangChain Documents
 */

export async function extractTextFromFile(
  file: File
): Promise<Document[]> {
  try {
    // Convert uploaded file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // =========================
    // TXT / MD / CSV SUPPORT
    // =========================
    if (
      file.type === "text/plain" ||
      file.type === "text/markdown" ||
      file.name.toLowerCase().endsWith(".txt") ||
      file.name.toLowerCase().endsWith(".md") ||
      file.name.toLowerCase().endsWith(".csv")
    ) {
      const text = buffer.toString("utf-8");

      if (!text || !text.trim()) {
        throw new Error("Uploaded text file is empty.");
      }

      return [
        new Document({
          pageContent: text,
          metadata: {
            source: file.name,
            type: "text",
          },
        }),
      ];
    }

    // =========================
    // UNSUPPORTED FILES
    // =========================
    throw new Error(
      `Unsupported file type: ${file.name}. Only TXT, MD, and CSV files are currently supported.`
    );
  } catch (error: any) {
    console.error("Error in extractTextFromFile:", error);

    throw new Error(
      `Ingestion failed: ${error.message}`
    );
  }
}