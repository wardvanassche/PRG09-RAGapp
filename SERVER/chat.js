import express from 'express';
import {ChatOllama} from "@langchain/ollama";
import {AIMessage, HumanMessage, SystemMessage} from "@langchain/core/messages";
import {loadVectorStore} from "./faissStore.js";

const router = express.Router();

// llm model
const model = new ChatOllama({
    model: process.env.OLLAMA_LLM_MODEL, // or any model you have pulled in Ollama
    baseUrl: process.env.OLLAMA_BASE_URL, // Default Ollama URL
});

router.post("/", async (req, res) => {

    // get prompt from request body
    const prompt = req.body.prompt;
    console.log("Received prompt:", prompt);

    // get history from request body
    const history = req.body.history;
    console.log("Received history:", history);

    // get context from vectordata
    const vectorStore = await loadVectorStore();

    // get relevant context from vector data (based on human prompt)
    const relevantDocs = await vectorStore.similaritySearch(prompt, 3);
    const contextText = relevantDocs.map(d => d.pageContent).join("\n---\n")

    // messages
    let messages = [
        new SystemMessage('Je bent een behulpzame assistent'),
        new HumanMessage(`Hier is wat context:\n${contextText}\n\nVraag: ${prompt}`),
    ];

    for (const {human, ai} of history) {
        messages.push(new HumanMessage(human))
        messages.push(new AIMessage(ai))
    }

    messages.push(new HumanMessage(prompt))

    // stream response to client
    const stream = await model.stream(messages);
    res.setHeader('Content-Type', 'text/plain');

    for await (const chunk of stream) {
        console.log(chunk.content)
        res.write(chunk.content)
    }

    res.end()
})

export default router;