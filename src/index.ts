import { toNodeHandler } from "better-auth/node";
import compression from "compression";
import cors from "cors";
import express from "express";
import config from "./config/index.js";
import { auth } from "./lib/auth.js";
import { notFound } from "./middlewares/notFound.js";

const app = express();

// Middleware
app.use(express.json());
app.use(compression());

app.use((req, res, next) => {
    console.log("Request Origin:", req.headers.origin);
    next();
});

app.use(
    cors({
        origin: config.OriginUrl,
        credentials: true,
    }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

// Default route for testing
app.get("/", (_req, res) => {
    res.send("API is running");
});

app.use(notFound);

export default app;
