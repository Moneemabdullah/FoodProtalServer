import { toNodeHandler } from "better-auth/node";
import compression from "compression";
import cors from "cors";
import express from "express";
import config from "./config/index";
import { auth } from "./lib/auth";
import { notFound } from "./middlewares/notFound";
import providerProfileRoutes from "./modules/ProviderProfile/ProviderProfile.Routes";
import userRoutes from "./modules/User/user.routes";

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
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/provider-profiles", providerProfileRoutes);

// Default route for testing
app.get("/", (_req, res) => {
    res.json({ message: "API is running" });
});

app.use(notFound);

export default app;
