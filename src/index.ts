import { toNodeHandler } from "better-auth/node";
import compression from "compression";
import cors, { CorsOptions } from "cors";
import express, { Application } from "express";
import config from "./config/index.js";
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

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || config.allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
    ],
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use(compression());
app.use("/api/auth", authHandler);

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
