import type { Review } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

const createReview = async (data: Review) => {
    const review = await prisma.review.create({
        data,
    });
    return review;
};

const getAllReviews = async () => {
    const reviews = await prisma.review.findMany({
        include: {
            user: true,
            meal: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return reviews;
};

const getReviewById = async (id: Review["id"]) => {
    const review = await prisma.review.findUnique({
        where: { id },
        include: {
            user: true,
            meal: true,
        },
    });
    return review;
};

const updateReview = async (id: Review["id"], data: Partial<Review>) => {
    const review = await prisma.review.update({
        where: { id },
        data,
    });
    return review;
};

const deleteReview = async (id: Review["id"]) => {
    const review = await prisma.review.delete({
        where: { id },
    });
    return review;
};

const getReviewsByMeal = async (mealId: Review["mealId"]) => {
    const reviews = await prisma.review.findMany({
        where: { mealId },
        include: {
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const aggregate = await prisma.review.aggregate({
        where: { mealId },
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        },
    });

    return {
        reviews,
        averageRating: aggregate._avg.rating ?? 0,
        totalReviews: aggregate._count.rating,
    };
};

export default {
    createReview,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview,
    getReviewsByMeal,
};
