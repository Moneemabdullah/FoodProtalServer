import type { ProviderProfile, User } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

interface CreateProviderProfileInput {
    ownerId: string;
    restaurantName: string;
    description?: string | null;
    image?: string | null;
    locationId?: string | null;
}

const createProviderProfile = async (data: CreateProviderProfileInput) => {
    const providerProfile = await prisma.providerProfile.create({
        data,
    });
    return providerProfile;
};

const getProviderProfileById = async (id: ProviderProfile["id"]) => {
    const providerProfile = await prisma.providerProfile.findUnique({
        where: { id },
    });
    return providerProfile;
};

const updateProviderProfile = async (
    id: ProviderProfile["id"],
    data: Partial<ProviderProfile>,
) => {
    const providerProfile = await prisma.providerProfile.update({
        where: { id },
        data,
    });
    return providerProfile;
};

const deleteProviderProfile = async (id: ProviderProfile["id"]) => {
    const providerProfile = await prisma.providerProfile.delete({
        where: { id },
    });
    return providerProfile;
};

const getAllProviderProfiles = async () => {
    const providerProfiles = await prisma.providerProfile.findMany();
    return providerProfiles;
};

const getProviderProfileByOwnerId = async (ownerId: ProviderProfile["ownerId"]) => {
    const providerProfile = await prisma.providerProfile.findFirst({
        where: { ownerId },
    });
    return providerProfile;
};

const getOrCreateProviderProfileByOwnerId = async (
    ownerId: ProviderProfile["ownerId"],
    restaurantName: string,
) => {
    const existingProfile = await getProviderProfileByOwnerId(ownerId);

    if (existingProfile) {
        return existingProfile;
    }

    const providerProfile = await prisma.providerProfile.create({
        data: {
            ownerId,
            restaurantName,
        },
    });

    return providerProfile;
};

const rateProvider = async (
    providerId: ProviderProfile["id"],
    userId: User["id"],
    rating: number,
) => {
    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
    }

    // Upsert user rating
    await prisma.providerProfileRating.upsert({
        where: {
            providerId_userId: {
                providerId,
                userId,
            },
        },
        update: {
            rating,
        },
        create: {
            providerId,
            userId,
            rating,
        },
    });

    // Calculate average
    const avg = await prisma.providerProfileRating.aggregate({
        where: { providerId },
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        },
    });

    return {
        averageRating: avg._avg.rating ?? 0,
        totalRatings: avg._count.rating,
    };
};

export default {
    createProviderProfile,
    getProviderProfileById,
    getProviderProfileByOwnerId,
    getOrCreateProviderProfileByOwnerId,
    updateProviderProfile,
    deleteProviderProfile,
    getAllProviderProfiles,
    rateProvider,
};
