import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { notFoundMiddleware } from "./utils/notFoundMiddleware.js";
import { errorMiddleware } from "./utils/errorMiddleware.js";

dotenv.config();

const app = express();

// process.env.PORT is created via .env
const PORT = process.env.PORT || 8000;

app.use(morgan("dev"))
app.use(express.json());


// Experimentally start the server, will be removed soon
// app.get("/", (req, res) => {
//   res.send("LOADED!")
// })


app.use(notFoundMiddleware)
app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})