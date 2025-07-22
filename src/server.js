import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// process.env.PORT is created via .env
const PORT = process.env.PORT || 8000;

app.use(express.json());

// Experimentally start the server, will be removed soon
app.get("/", (req, res) => {
  res.send("LOADED!")
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})