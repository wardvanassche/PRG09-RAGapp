import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf"
import {FaissStore} from "@langchain/community/vectorstores/faiss";
import {OllamaEmbeddings} from "@langchain/ollama";
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";

export async function creatingVectorStore() {
    console.log("Creating FAISS vector store...");

// load
    const loader = new PDFLoader("./assets/context/cursuswijzer.pdf");
    const docs = await loader.load();

// split
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments(docs);

// embedding model
    const embeddings = new OllamaEmbeddings({
        model: process.env.OLLAMA_EMBEDDING_MODEL, // or any model you have pulled in Ollama
        baseUrl: process.env.OLLAMA_BASE_URL, // Default Ollama URL
    });

// embed and create vector store
    const vectorStore = await FaissStore.fromDocuments(splitDocs, embeddings);
    await vectorStore.save("./faiss-index");

    console.log("FAISS vector store saved to ./faiss-index");
}