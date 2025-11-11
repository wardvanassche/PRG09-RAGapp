import express from 'express'
import cors from 'cors'
import { ChatOllama } from "@langchain/ollama";

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const model = new ChatOllama({
    model: process.env.OLLAMA_MODEL_NAME, // or any model you have pulled in Ollama
    baseUrl: process.env.OLLAMA_BASE_URL, // Default Ollama URL
});

app.get('/', (req, res) => {
    res.json({ message: 'Hello, world!' })
})

// Use in your Express route
app.post("/chat", async (req, res) => {
    const prompt = req.body.prompt;
    console.log("Received prompt:", prompt); // logs received prompt in terminal

    const response = await model.invoke(prompt);
    res.json({ response: response.content });
});

app.listen(3000, () => console.log(`Server running on http://localhost:3000`))