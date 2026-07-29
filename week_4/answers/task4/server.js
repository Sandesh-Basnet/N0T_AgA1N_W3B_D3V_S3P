import express from "express";
import todoRoutes from "./routes/todoRoutes.js";
import { requestLogger } from "./middleware/logger.js";

const app = express();
const PORT = 3000;

app.use(requestLogger);
app.use(express.json());
app.use("/api/todos", todoRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
