import type { NextFunction, Request, Response } from "express";
import type { Review } from "@prisma/client";
import reviewService from "./review.service.js";

const createReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const payload = req.body as {
            mealId?: string;
            rating?: number;
            comment?: string;
        };

        if (!payload.mealId || typeof payload.mealId !== "string") {
            return res.status(400).json({
                success: false,
                message: "mealId is required",
            });
        }

        if (typeof payload.rating !== "number" || payload.rating < 1 || payload.rating > 5) {
            return res.status(400).json({
                success: false,
                message: "rating must be a number between 1 and 5",
            });
        }

        const review = await reviewService.createReview({
            userId: req.user.id,
            mealId: payload.mealId,
            rating: payload.rating,
            comment:
                typeof payload.comment === "string" && payload.comment.trim()
                    ? payload.comment.trim()
                    : null,
        });

        return res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review,
        });
    } catch (error) {
        next(error);
    }
};

const getAllReviews = async (_req: Request, res: Response) => {
    try {
        const reviews = await reviewService.getAllReviews();

        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: reviews,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch reviews",
        });
    }
};

const getReviewById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review id",
            });
        }

        const review = await reviewService.getReviewById(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Review fetched successfully",
            data: review,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch review",
        });
    }
};

const updateReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review id",
            });
        }

        const payload = req.body as Partial<Review>;
        const review = await reviewService.updateReview(id, payload);

        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: review,
        });
    } catch (error) {
        next(error);
    }
};

const deleteReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review id",
            });
        }

        await reviewService.deleteReview(id);

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

const getReviewsByMeal = async (req: Request, res: Response) => {
    try {
        const { mealId } = req.params;
        if (!mealId || Array.isArray(mealId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid meal id",
            });
        }

        const result = await reviewService.getReviewsByMeal(mealId);

        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: result.reviews,
            dataSummary: {
                averageRating: result.averageRating,
                totalReviews: result.totalReviews,
            },
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch reviews",
        });
    }
};

export default {
    createReview,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview,
    getReviewsByMeal,
};
