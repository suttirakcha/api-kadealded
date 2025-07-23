import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { notFoundUtil } from "./utils/notFound.util.js";
import { errorUtil } from "./utils/error.util.js";
import userRouter from "./routers/authRouter.js";


dotenv.config();

const app = express();

// process.env.PORT is created via .env
const PORT = process.env.PORT || 8000;

app.use(morgan("dev"))
app.use(express.json());

app.use('/api',userRouter)


// Experimentally start the server, will be removed soon
// app.get("/", (req, res) => {
//   res.send("LOADED!")
// })


app.use(notFoundUtil)
app.use(errorUtil)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})