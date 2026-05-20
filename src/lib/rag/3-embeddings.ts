import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Embeddings } from "@langchain/core/embeddings";

export class TruncatedGoogleEmbeddings extends Embeddings {
  private baseEmbeddings: GoogleGenerativeAIEmbeddings;
  private dimensions: number;

  constructor(dimensions: number = 768) {
    super({});
    this.dimensions = dimensions;
    this.baseEmbeddings = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-2", 
    });
  }

  async embedDocuments(documents: string[]): Promise<number[][]> {
    const vectors = await this.baseEmbeddings.embedDocuments(documents);
    return vectors.map((v) => v.slice(0, this.dimensions));
  }

  async embedQuery(document: string): Promise<number[]> {
    const vector = await this.baseEmbeddings.embedQuery(document);
    return vector.slice(0, this.dimensions);
  }
}

/**
 * STEP 3: TEXT EMBEDDINGS (GOOGLE GEMINI)
 * 
 * What this block does:
 * We need to convert our text chunks into vectors so MongoDB Atlas can perform 
 * mathematical similarity searches. LangChain's Embeddings class provides a 
 * standard interface to interact with Vector Stores.
 * 
 * Note: It automatically looks for the process.env.GEMINI_API_KEY
 */
export function getEmbeddingsModel() {
  // We use a custom wrapper to slice the 3072-dimensional embeddings down to 768,
  // making it compatible with the existing MongoDB vector index.
  // Gemini Embedding 2 supports Matryoshka Representation Learning (MRL),
  // which means truncating the vectors preserves the semantic quality.
  return new TruncatedGoogleEmbeddings(768);
}
