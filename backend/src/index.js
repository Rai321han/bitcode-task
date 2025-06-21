import express from "express";
import dotenv from "dotenv";
import roadmapRouter from "./routes/roadmap.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api", roadmapRouter);

const port = process.env.BACKEND_PORT || 5100;
app.listen(port, () => {
  console.log("Server running on port: ", port);
});
