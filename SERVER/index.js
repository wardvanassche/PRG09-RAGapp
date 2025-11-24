import express, {response} from 'express'
import cors from 'cors'
import {ChatOllama} from "@langchain/ollama";
import {AIMessage, HumanMessage, SystemMessage} from "@langchain/core/messages";

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const model = new ChatOllama({
    model: process.env.OLLAMA_LLM_MODEL, // or any model you have pulled in Ollama
    baseUrl: process.env.OLLAMA_BASE_URL, // Default Ollama URL
});

app.get('/', (req, res) => {
    res.json({message: 'Hello, world!'})
})

app.post("/chat", async (req, res) => {

    // get prompt from request body
    const prompt = req.body.prompt;
    console.log("Received prompt:", prompt);

    // get history from request body
    const history = req.body.history;
    console.log("Received history:", history);

    // define messages
    let messages = [
        new SystemMessage('You are a helpful assistant.'),
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