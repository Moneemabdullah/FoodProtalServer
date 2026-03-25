import { toNodeHandler } from "better-auth/node";
import compression from "compression";
import cors from "cors";
import express, { Application } from "express";
import { auth } from "./lib/auth.js";
import errorHandler from "./middlewares/globalErrorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import categoryRoutes from "./modules/Category/category.routes.js";
import locationRoutes from "./modules/Location/location.routes.js";
import mealRoutes from "./modules/Meal/meal.routes.js";
import orderRoutes from "./modules/Order/order.routes.js";
import orderItemRoutes from "./modules/OrderItem/orderItem.routes.js";
import providerProfileRoutes from "./modules/ProviderProfile/ProviderProfile.Routes.js";
import reviewRoutes from "./modules/Review/review.routes.js";
import userRoutes from "./modules/User/user.routes.js";

const app: Application = express();
const authHandler = toNodeHandler(auth);

app.use(express.json());
app.use(compression());

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

// Express 5 requires named wildcards, and Better Auth already exposes a Node handler.
app.all("/api/auth/{*authPath}", async (req, res) => {
    await authHandler(req, res);
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/provider-profiles", providerProfileRoutes);
app.use("/api/v1/meals", mealRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/locations", locationRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/order-items", orderItemRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.get("/", (_req, res) => {
    res.json({ message: "API is running" });
});

app.use(notFound);
app.use(errorHandler);

export default app;
