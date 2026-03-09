import express from "express";
import compression from "compression";
import config from "./config/index.js";
import cors from "cors";
import { connect } from "node:http2";
import { connectToDatabase } from "./config/db.js";

const app = express();

app.use(express.json());
app.use(compression());

await connectToDatabase();

app.use(
    cors({
        origin: config.OriginUrl,
        credentials: true,
    }),
);

// Default route for testing
app.get("/", (_req, res) => {
    res.send("API is running");
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});

export default app;
