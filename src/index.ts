import express from "express";
import postsRouter from './routes/posts/posts.routes'
import cors from "cors";


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/v1/posts', postsRouter);



app.get('/', (req, res) => {
    res.send("Hello");
})

app.listen(PORT, () => {
    console.log(`🔺 Server running on http://localhost:${PORT}`);
})