import type { Request, Response } from "express";
import type { Meal } from "../../../generated/prisma/client";
import mealService from "./meal.service";

const createMeal = async (req: Request, res: Response) => {
    try {
        const payload = req.body as Meal;
        const meal = await mealService.createMeal(payload);

        return res.status(201).json({
            success: true,
            message: "Meal created successfully",
            data: meal,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to create meal",
        });
    }
};

const getAllMeals = async (_req: Request, res: Response) => {
    try {
        const meals = await mealService.getAllMeals();

        return res.status(200).json({
            success: true,
            message: "Meals fetched successfully",
            data: meals,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch meals",
        });
    }
};

const getMealById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid meal id",
            });
        }

        const meal = await mealService.getMealById(id);

        if (!meal) {
            return res.status(404).json({
                success: false,
                message: "Meal not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Meal fetched successfully",
            data: meal,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch meal",
        });
    }
};

const updateMeal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid meal id",
            });
        }

        const payload = req.body as Partial<Meal>;
        const meal = await mealService.updateMeal(id, payload);

        return res.status(200).json({
            success: true,
            message: "Meal updated successfully",
            data: meal,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to update meal",
        });
    }
};

const deleteMeal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid meal id",
            });
        }

        await mealService.deleteMeal(id);

        return res.status(200).json({
            success: true,
            message: "Meal deleted successfully",
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to delete meal",
        });
    }
};

const getMealsByProvider = async (req: Request, res: Response) => {
    try {
        const { providerId } = req.params;
        if (!providerId || Array.isArray(providerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid provider id",
            });
        }

        const meals = await mealService.getMealsByProvider(providerId);

        return res.status(200).json({
            success: true,
            message: "Meals fetched successfully",
            data: meals,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch meals",
        });
    }
};

const getMealsByCategory = async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.params;
        if (!categoryId || Array.isArray(categoryId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category id",
            });
        }

        const meals = await mealService.getMealsByCategory(categoryId);

        return res.status(200).json({
            success: true,
            message: "Meals fetched successfully",
            data: meals,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch meals",
        });
    }
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
