import type { NextFunction, Request, Response } from "express";
import type { Category } from "../../../generated/prisma/client";
import categoryService from "./category.service";

const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const payload = req.body as Category;
        const category = await categoryService.createCategory(payload);

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

const getAllCategories = async (
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const categories = await categoryService.getAllCategories();

        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: categories,
        });
    } catch (error) {
        next(error);
    }
};

const getCategoryById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category id",
            });
        }

        const category = await categoryService.getCategoryById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category id",
            });
        }

        const payload = req.body as Partial<Category>;
        const category = await categoryService.updateCategory(id, payload);

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category id",
            });
        }

        await categoryService.deleteCategory(id);

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export default {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
