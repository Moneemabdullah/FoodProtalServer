import type { NextFunction, Request, Response } from "express";
import type { Location } from "@prisma/client";
import locationService from "./location.service";

const createLocation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const payload = req.body as Location;
        const location = await locationService.createLocation(payload);

        return res.status(201).json({
            success: true,
            message: "Location created successfully",
            data: location,
        });
    } catch (error) {
        next(error);
    }
};

const getAllLocations = async (
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const locations = await locationService.getAllLocations();

        return res.status(200).json({
            success: true,
            message: "Locations fetched successfully",
            data: locations,
        });
    } catch (error) {
        next(error);
    }
};

const getLocationById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid location id",
            });
        }

        const location = await locationService.getLocationById(id);

        if (!location) {
            return res.status(404).json({
                success: false,
                message: "Location not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Location fetched successfully",
            data: location,
        });
    } catch (error) {
        next(error);
    }
};

const updateLocation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid location id",
            });
        }

        const payload = req.body as Partial<Location>;
        const location = await locationService.updateLocation(id, payload);

        return res.status(200).json({
            success: true,
            message: "Location updated successfully",
            data: location,
        });
    } catch (error) {
        next(error);
    }
};

const deleteLocation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid location id",
            });
        }

        await locationService.deleteLocation(id);

        return res.status(200).json({
            success: true,
            message: "Location deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export default {
    createLocation,
    getAllLocations,
    getLocationById,
    updateLocation,
    deleteLocation,
};
