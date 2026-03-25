import { Router } from "express";
import reviewController from "./review.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = Router();

router.post("/", auth(), reviewController.createReview);
router.get("/", reviewController.getAllReviews);
router.get("/:id", reviewController.getReviewById);
router.patch("/:id", auth(Role.CUSTOMER), reviewController.updateReview);
router.delete("/:id", auth(Role.ADMIN), reviewController.deleteReview);
router.get("/meal/:mealId", reviewController.getReviewsByMeal);

export default router;
