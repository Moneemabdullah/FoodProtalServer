import { Meal } from "../../../generated/prisma/client";
import prisma from "../../lib/prisma";

const createMeal = async (data: Meal) => {
    const meal = await prisma.meal.create({
        data,
    });
    return meal;
};

const getAllMeals = async () => {
    const meals = await prisma.meal.findMany({
        include: {
            category: true,
            provider: true,
        },
    });
    return meals;
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
