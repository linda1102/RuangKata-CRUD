import express from "express";
import postsRouter from './routes/posts/posts.routes'
import cors from "cors";
import libraryRouter from "./routes/library/library.routes";


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/test", (req, res) => {
  console.log("🔥 TEST MASUK");
  res.json({   
    message: "SERVER BERHASIL",
  });
});

app.use("/api/v1/library", libraryRouter);

app.use('/api/v1/posts', postsRouter);



app.get('/', (req, res) => {
    res.send("Hello");
})

app.listen(PORT, () => {
    console.log(`🔺 Server running on http://localhost:${PORT}`);
})