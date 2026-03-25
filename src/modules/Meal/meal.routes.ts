import { Router } from "express";
import mealController from "./meal.controller.js";
import { Role } from "@prisma/client";
import { auth } from "../../middlewares/auth.js";
import { uploadMiddleware } from "../../middlewares/upload.middleware.js";

const router = Router();

router.post(
    "/",
    auth(Role.PROVIDER),
    uploadMiddleware.single("image"),
    mealController.createMeal,
);
router.get("/", mealController.getAllMeals);
router.get("/:id", mealController.getMealById);
router.patch("/:id", auth(Role.PROVIDER), uploadMiddleware.single("image"), mealController.updateMeal);
router.delete("/:id", auth(Role.PROVIDER), mealController.deleteMeal);
router.get("/provider/:providerId", mealController.getMealsByProvider);
router.get("/category/:categoryId", mealController.getMealsByCategory);

export default router;
