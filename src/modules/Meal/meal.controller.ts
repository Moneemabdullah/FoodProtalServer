import type { NextFunction, Request, Response } from "express";
import mealService from "./meal.service.js";
import {
    parsePaginationParams,
    buildPaginationMeta,
    isValidSortBy,
} from "../../utils/pagination.js";

const ALLOWED_SORT_FIELDS = ["price", "createdAt", "title"];

const normalizeOptionalString = (
    value: unknown,
): string | null | undefined => {
    if (typeof value !== "string") {
        return undefined;
    }

    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
};

const createMeal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const payload = req.body as Record<string, unknown>;
        const providerId = await mealService.resolveProviderProfileId(req.user.id);

        if (!providerId) {
            return res.status(400).json({
                success: false,
                message: "Provider profile not found for this user",
            });
        }

        if (
            typeof payload.title !== "string" ||
            !payload.title.trim() ||
            typeof payload.categoryId !== "string" ||
            !payload.categoryId.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "title and categoryId are required",
            });
        }

        const price = Number(payload.price);
        if (!Number.isFinite(price) || price <= 0) {
            return res.status(400).json({
                success: false,
                message: "price must be a positive number",
            });
        }

        const description = normalizeOptionalString(payload.description);
        const image = normalizeOptionalString(payload.image);

        const mealPayload = {
            title: payload.title.trim(),
            price,
            categoryId: payload.categoryId.trim(),
            providerId,
            ...(description !== undefined ? { description } : {}),
            ...(image !== undefined ? { image } : {}),
        };

        if (req.file) {
            mealPayload.image = (req.file as any).secure_url || req.file.path;
        }

        const meal = await mealService.createMeal(mealPayload);

        return res.status(201).json({
            success: true,
            message: "Meal created successfully",
            data: meal,
        });
    } catch (error) {
        next(error);
    }
};

const getAllMeals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query as Record<string, unknown>;

        const paginationParams = parsePaginationParams(query);

        if (
            paginationParams.sortBy !== "createdAt" &&
            !isValidSortBy(paginationParams.sortBy, ALLOWED_SORT_FIELDS)
        ) {
            return res.status(400).json({
                success: false,
                message: `Invalid sortBy value. Allowed values: ${ALLOWED_SORT_FIELDS.join(", ")}`,
            });
        }

        const search =
            typeof query.search === "string" ? query.search : undefined;
        const categoryId =
            typeof query.categoryId === "string" ? query.categoryId : undefined;
        const providerId =
            typeof query.providerId === "string" ? query.providerId : undefined;

        const serviceParams: Parameters<typeof mealService.getAllMeals>[0] = {
            ...paginationParams,
            sortBy: paginationParams.sortBy as "price" | "createdAt" | "title",
        };

        if (search) serviceParams.search = search;
        if (categoryId) serviceParams.categoryId = categoryId;
        if (providerId) serviceParams.providerId = providerId;

        const { data, total } = await mealService.getAllMeals(serviceParams);

        const meta = buildPaginationMeta(
            paginationParams.page,
            paginationParams.limit,
            total,
        );

        return res.status(200).json({
            success: true,
            message: "Meals fetched successfully",
            meta,
            data,
        });
    } catch (error) {
        next(error);
    }
};

const getMealById = async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (error) {
        next(error);
    }
};

const updateMeal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid meal id",
            });
        }

        const payload = req.body as Record<string, unknown>;
        const mealPayload: Record<string, unknown> = {};

        if (typeof payload.title === "string") {
            const title = payload.title.trim();
            if (!title) {
                return res.status(400).json({
                    success: false,
                    message: "title cannot be empty",
                });
            }
            mealPayload.title = title;
        }

        if (payload.description !== undefined) {
            mealPayload.description = normalizeOptionalString(payload.description);
        }

        if (payload.image !== undefined) {
            mealPayload.image = normalizeOptionalString(payload.image);
        }

        if (payload.categoryId !== undefined) {
            if (typeof payload.categoryId !== "string" || !payload.categoryId.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "categoryId cannot be empty",
                });
            }
            mealPayload.categoryId = payload.categoryId.trim();
        }

        if (payload.price !== undefined) {
            const price = Number(payload.price);
            if (!Number.isFinite(price) || price <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "price must be a positive number",
                });
            }
            mealPayload.price = price;
        }

        if (req.file) {
            mealPayload.image = (req.file as any).secure_url || req.file.path;
        }

        const meal = await mealService.updateMeal(id, mealPayload);

        return res.status(200).json({
            success: true,
            message: "Meal updated successfully",
            data: meal,
        });
    } catch (error) {
        next(error);
    }
};

const deleteMeal = async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (error) {
        next(error);
    }
};

const getMealsByProvider = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
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
    } catch (error) {
        next(error);
    }
};

const getMealsByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
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
    } catch (error) {
        next(error);
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
