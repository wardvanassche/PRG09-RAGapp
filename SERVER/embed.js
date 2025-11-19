import {OllamaEmbeddings} from "@langchain/ollama";

const embeddings = new OllamaEmbeddings({
    model: process.env.OLLAMA_EMBEDDING_MODEL, // or any model you have pulled in Ollama
    baseUrl: process.env.OLLAMA_BASE_URL, // Default Ollama URL
});

const vectordata = await embeddings.embedQuery("Hello world!");
console.log(vectordata);
console.log(`Created vector with ${vectordata.length} values.`)