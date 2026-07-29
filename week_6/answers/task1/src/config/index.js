import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  db: {
    storage: process.env.DB_STORAGE || "./database.sqlite",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "fallback-secret",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: process.env.CORS_METHOD?.split(",") || ["GET", "POST", "PUT", "DELETE"],
  },
};
