import type { Location } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

const createLocation = async (data: Location) => {
    const location = await prisma.location.create({
        data,
    });
    return location;
};

const getAllLocations = async () => {
    const locations = await prisma.location.findMany({
        include: {
            providerProfile: true,
        },
    });
    return locations;
};

const getLocationById = async (id: Location["id"]) => {
    const location = await prisma.location.findUnique({
        where: { id },
        include: {
            providerProfile: true,
        },
    });
    return location;
};

const updateLocation = async (id: Location["id"], data: Partial<Location>) => {
    const location = await prisma.location.update({
        where: { id },
        data,
    });
    return location;
};

const deleteLocation = async (id: Location["id"]) => {
    const location = await prisma.location.delete({
        where: { id },
    });
    return location;
};

export default {
    createLocation,
    getAllLocations,
    getLocationById,
    updateLocation,
    deleteLocation,
};
