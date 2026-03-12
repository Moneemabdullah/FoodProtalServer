import { Router } from "express";
import reviewController from "./review.controller";
import { authenticated } from "../../middlewares/auth";

const router = Router();

router.post("/", authenticated, reviewController.createReview);
router.get("/", reviewController.getAllReviews);
router.get("/:id", reviewController.getReviewById);
router.patch("/:id", authenticated, reviewController.updateReview);
router.delete("/:id", authenticated, reviewController.deleteReview);
router.get("/meal/:mealId", reviewController.getReviewsByMeal);

export default router;
