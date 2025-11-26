import express from 'express'
import cors from 'cors'
import {ChatOllama, OllamaEmbeddings} from "@langchain/ollama";
import {AIMessage, HumanMessage, SystemMessage} from "@langchain/core/messages";
import {FaissStore} from "@langchain/community/vectorstores/faiss";

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const model = new ChatOllama({
    model: process.env.OLLAMA_LLM_MODEL, // or any model you have pulled in Ollama
    baseUrl: process.env.OLLAMA_BASE_URL, // Default Ollama URL
});


// embedding model
const embeddings = new OllamaEmbeddings({
    model: process.env.OLLAMA_EMBEDDING_MODEL, // or any model you have pulled in Ollama
    baseUrl: process.env.OLLAMA_BASE_URL, // Default Ollama URL
});

app.get('/', (req, res) => {
    res.json({message: 'Server is running'})
})

app.post("/chat", async (req, res) => {

    // get prompt from request body
    const prompt = req.body.prompt;
    console.log("Received prompt:", prompt);

    // get history from request body
    const history = req.body.history;
    console.log("Received history:", history);

    // get context from vectordata
    const vectorStore = await FaissStore.load("faiss-index", embeddings);
    // get relevant context from vector data (based on human prompt)
    const relevantDocs = await vectorStore.similaritySearch(prompt, 3);
    const contextText = relevantDocs.map(d => d.pageContent).join("\n---\n")

    // define messages
    let messages = [
        new SystemMessage('Je bent een behulpzame assistent'),
        new HumanMessage(`Hier is wat context:\n${contextText}\n\nVraag: ${prompt}`),
    ];

    for (const {human, ai} of history) {
        messages.push(new HumanMessage(human))
        messages.push(new AIMessage(ai))
    }

    messages.push(new HumanMessage(prompt))

    console.log(messages);

    const stream = await model.stream(messages);
    res.setHeader('Content-Type', 'text/plain');
    for await (const chunk of stream) {
        console.log(chunk.content)
        res.write(chunk.content)
    }
    res.end()
});

app.listen(3000, () => console.log(`Server running on http://localhost:3000`))