import { auth } from "./lib/auth";
import compression from "compression";
import cors from "cors";
import express, { Application } from "express";
import config from "./config/index";

import { notFound } from "./middlewares/notFound";

import providerProfileRoutes from "./modules/ProviderProfile/ProviderProfile.Routes";
import userRoutes from "./modules/User/user.routes";
import mealRoutes from "./modules/Meal/meal.routes";
import categoryRoutes from "./modules/Category/category.routes";
import locationRoutes from "./modules/Location/location.routes";
import orderRoutes from "./modules/Order/order.routes";
import orderItemRoutes from "./modules/OrderItem/orderItem.routes";
import reviewRoutes from "./modules/Review/review.routes";
import errorHandler from "./middlewares/globalErrorHandler";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(compression());

// app.use((req, res, next) => {
//     console.log("Request Origin:", req.headers.origin);
//     console.log("Request Cookies:", req.headers.cookie);
//     next();
// });

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
        ],
        credentials: true,
    }),
);

app.all("/api/auth/*", async (req, res) => {
    try {
        const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

        const headers = new Headers();
        Object.entries(req.headers).forEach(([key, value]) => {
            if (value) headers.set(key, String(value));
        });

        const request = new Request(url, {
            method: req.method,
            headers,
            body:
                req.method !== "GET" && req.method !== "HEAD"
                    ? JSON.stringify(req.body)
                    : undefined,
        });

        // 🔥 IMPORTANT CHANGE
        const response = await auth.api(request);

        res.status(response.status);

        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        const text = await response.text();
        res.send(text);
    } catch (error) {
        console.error("Auth error:", error);
        res.status(500).json({ message: "Auth failed" });
    }
});

// All Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/provider-profiles", providerProfileRoutes);
app.use("/api/v1/meals", mealRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/locations", locationRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/order-items", orderItemRoutes);
app.use("/api/v1/reviews", reviewRoutes);

// Default route for testing
app.get("/", (_req, res) => {
    res.json({ message: "API is running" });
});

app.use(notFound);
app.use(errorHandler);

export default app;
