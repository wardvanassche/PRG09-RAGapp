import {FaissStore} from "@langchain/community/vectorstores/faiss";
import {OllamaEmbeddings} from "@langchain/ollama";

let vectorStore = null;

export async function loadVectorStore() {
    if (!vectorStore) {
        const embeddings = new OllamaEmbeddings({
            model: process.env.OLLAMA_EMBEDDING_MODEL,
            baseUrl: process.env.OLLAMA_BASE_URL,
        });

        vectorStore = await FaissStore.load("faiss-index", embeddings);
        console.log("FAISS index loaded.");
    }

    return vectorStore;
}