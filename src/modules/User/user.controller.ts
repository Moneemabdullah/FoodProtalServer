import type { Request, Response } from "express";
import type { User } from "../../../generated/prisma/client";
import userService from "./user.service";

const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json({
            success: true,
            data: users,
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

const updateUser = async (req: Request, res: Response) => {
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
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to update user",
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
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
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to delete user",
        });
    }
};

export default {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
