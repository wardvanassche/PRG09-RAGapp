import express from 'express';
import cors from 'cors';
import chatRoute from './chat.js';
import {creatingVectorStore} from "./embed.js";

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Creating embeddings and vector store
await creatingVectorStore();

app.get('/', (req, res) => {
    res.json({message: 'Server is running'})
})

app.use('/chat', chatRoute)

app.listen(3000, () =>
    console.log(`Server running on http://localhost:3000`)
);