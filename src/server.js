import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { notFoundUtil } from "./utils/notFound.util.js";
import { errorUtil } from "./utils/error.util.js";
import adminRouter from "./routers/adminRouter.js";
import authUserRouter from "./routers/authUserRouter.js";
import userRouter from "./routers/userRouter.js";
import contactRoute from "./routers/contactUsRouter.js";
import otpRouter from "./routers/otpRouter.js";
import { chatMiddleware } from "./middlewares/chat.middleware.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authUserRouter);
app.use("/admin", adminRouter);
app.use("/api", userRouter);
app.use("/api", contactRoute);
app.use("/otp", otpRouter);

app.use(notFoundUtil);
app.use(errorUtil);

chatMiddleware(io)

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
