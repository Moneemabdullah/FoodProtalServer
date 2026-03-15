import type { NextFunction, Request, Response } from "express";
import type { Review } from "../../../generated/prisma/client";
import reviewService from "./review.service";

const createReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const payload = req.body as Review;
        const review = await reviewService.createReview(payload);

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
