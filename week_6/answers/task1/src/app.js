import express from "express";
import cors from "cors";
import { config } from "./config/index.js";
import { HandleNotFound, HandleError } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

const app = express();

app.use(cors({
  origin: config.cors.origin,
  methods: config.cors.methods,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Todo API");
});

app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);

app.use(HandleNotFound);
app.use(HandleError);

export default app;
