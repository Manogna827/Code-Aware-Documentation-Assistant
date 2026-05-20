import { Document } from "@langchain/core/documents";

/**
 * STEP 1: DOCUMENT INGESTION (LANGCHAIN)
 *
 * Supports:
 * - TXT
 * - MD
 * - CSV
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