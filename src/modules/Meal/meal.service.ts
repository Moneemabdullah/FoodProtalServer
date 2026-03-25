import type { Meal } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export interface MealPaginationParams {
    page: number;
    limit: number;
    skip: number;
    sortBy: "price" | "createdAt" | "title";
    sortOrder: "asc" | "desc";
    search?: string;
    categoryId?: string;
    providerId?: string;
}

export interface PaginatedMeals {
    data: Meal[];
    total: number;
}

const ALLOWED_SORT_FIELDS = ["price", "createdAt", "title"] as const;

const createMeal = async (data: Meal) => {
    const meal = await prisma.meal.create({
        data,
    });
    return meal;
};

const getAllMeals = async (
    params: MealPaginationParams,
): Promise<PaginatedMeals> => {
    const { skip, limit, sortBy, sortOrder, search, categoryId, providerId } =
        params;

    const where: Record<string, unknown> = {};

    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }

    if (categoryId) {
        where.categoryId = categoryId;
    }

    if (providerId) {
        where.providerId = providerId;
    }

    const orderBy: Record<string, "asc" | "desc"> = {};
    if (
        ALLOWED_SORT_FIELDS.includes(
            sortBy as (typeof ALLOWED_SORT_FIELDS)[number],
        )
    ) {
        orderBy[sortBy] = sortOrder;
    } else {
        orderBy.createdAt = "desc";
    }

    const [data, total] = await Promise.all([
        prisma.meal.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                category: true,
                provider: true,
            },
        }),
        prisma.meal.count({ where }),
    ]);

    return { data, total };
};

const getMealById = async (id: Meal["id"]) => {
    const meal = await prisma.meal.findUnique({
        where: { id },
        include: {
            category: true,
            provider: true,
        },
    });
    return meal;
};

const updateMeal = async (id: Meal["id"], data: Partial<Meal>) => {
    const meal = await prisma.meal.update({
        where: { id },
        data,
    });
    return meal;
};

const deleteMeal = async (id: Meal["id"]) => {
    const meal = await prisma.meal.delete({
        where: { id },
    });
    return meal;
};

const getMealsByProvider = async (providerId: Meal["providerId"]) => {
    const meals = await prisma.meal.findMany({
        where: { providerId },
        include: {
            category: true,
        },
    });
    return meals;
};

const getMealsByCategory = async (categoryId: Meal["categoryId"]) => {
    const meals = await prisma.meal.findMany({
        where: { categoryId },
        include: {
            provider: true,
        },
    });
    return meals;
};

export default {
    createMeal,
    getAllMeals,
    getMealById,
    updateMeal,
    deleteMeal,
    getMealsByProvider,
    getMealsByCategory,
};
