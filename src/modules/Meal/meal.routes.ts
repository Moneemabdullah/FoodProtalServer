import { Router } from "express";
import mealController from "./meal.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/", auth(Role.PROVIDER), mealController.createMeal);
router.get("/", mealController.getAllMeals);
router.get("/:id", mealController.getMealById);
router.patch("/:id", auth(Role.PROVIDER), mealController.updateMeal);
router.delete("/:id", auth(Role.PROVIDER), mealController.deleteMeal);
router.get("/provider/:providerId", mealController.getMealsByProvider);
router.get("/category/:categoryId", mealController.getMealsByCategory);

export default router;
