import type { NextFunction, Request, Response } from "express";
import type { User } from "../../../generated/prisma/client";
import userService from "./user.service";
import {
    parsePaginationParams,
    buildPaginationMeta,
    isValidSortBy,
} from "../../utils/pagination";

const ALLOWED_SORT_FIELDS = ["createdAt", "name", "email"];

const getAllUsers = async (req: Request, res: Response) => {
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

        const serviceParams: Parameters<typeof userService.getAllUsers>[0] = {
            ...paginationParams,
            sortBy: paginationParams.sortBy as "createdAt" | "name" | "email",
        };

        if (search) serviceParams.search = search;

        const { data, total } = await userService.getAllUsers(serviceParams);

        const meta = buildPaginationMeta(
            paginationParams.page,
            paginationParams.limit,
            total,
        );

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            meta,
            data,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};

const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
            });
        }

        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
        });
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
            });
        }

        const payload = req.body as Partial<User>;

        const user = await userService.updateUser(id, payload);
        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
            });
        }

        await userService.deleteUser(id);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
