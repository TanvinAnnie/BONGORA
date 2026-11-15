import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "BONGORA API is running!",
  });
});

export default app;