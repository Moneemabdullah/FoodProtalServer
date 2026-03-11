import type { Request, Response } from "express";
import type { ProviderProfile } from "../../../generated/prisma/client";
import providerProfileService from "./ProviderProfile.Service";

const createProviderProfile = async (req: Request, res: Response) => {
    try {
        const payload = req.body as ProviderProfile;
        const providerProfile =
            await providerProfileService.createProviderProfile(payload);

        return res.status(201).json({
            success: true,
            data: providerProfile,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to create provider profile",
        });
    }
};

const getAllProviderProfiles = async (_req: Request, res: Response) => {
    try {
        const providerProfiles =
            await providerProfileService.getAllProviderProfiles();

        return res.status(200).json({
            success: true,
            data: providerProfiles,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch provider profiles",
        });
    }
};

const getProviderProfileById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid provider profile id",
            });
        }

        const providerProfile =
            await providerProfileService.getProviderProfileById(id);

        if (!providerProfile) {
            return res.status(404).json({
                success: false,
                message: "Provider profile not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: providerProfile,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch provider profile",
        });
    }
};

const updateProviderProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid provider profile id",
            });
        }

        const payload = req.body as Partial<ProviderProfile>;

        const providerProfile =
            await providerProfileService.updateProviderProfile(id, payload);

        return res.status(200).json({
            success: true,
            data: providerProfile,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to update provider profile",
        });
    }
};

const deleteProviderProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid provider profile id",
            });
        }

        await providerProfileService.deleteProviderProfile(id);

        return res.status(200).json({
            success: true,
            message: "Provider profile deleted successfully",
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to delete provider profile",
        });
    }
};

const rateProvider = async (req: Request, res: Response) => {
    try {
        const { providerId } = req.params;
        if (!providerId || Array.isArray(providerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid provider id",
            });
        }

        const { userId, rating } = req.body as {
            userId: string;
            rating: number;
        };
        if (!userId || typeof userId !== "string") {
            return res.status(400).json({
                success: false,
                message: "userId is required",
            });
        }

        if (typeof rating !== "number") {
            return res.status(400).json({
                success: false,
                message: "rating must be a number",
            });
        }

        const ratingSummary = await providerProfileService.rateProvider(
            providerId,
            userId,
            Number(rating),
        );

        return res.status(200).json({
            success: true,
            data: ratingSummary,
        });
    } catch (error) {
        if (
            error instanceof Error &&
            error.message.includes("between 1 and 5")
        ) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to rate provider",
        });
    }
};

export default {
    createProviderProfile,
    getAllProviderProfiles,
    getProviderProfileById,
    updateProviderProfile,
    deleteProviderProfile,
    rateProvider,
};
