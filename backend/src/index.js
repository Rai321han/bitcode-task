import express from "express";
import dotenv from "dotenv";
import roadmapRouter from "./routes/roadmap.routes.js";
import commentsRouter from "./routes/comments.route.js";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", roadmapRouter);
app.use("/api", commentsRouter);
app.use("/api", authRouter);

const port = process.env.BACKEND_PORT || 5100;
app.listen(port, () => {
  console.log("Server running on port: ", port);
});
