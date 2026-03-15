import { User } from "../../../generated/prisma/client";
import prisma from "../../config/db";

export interface UserPaginationParams {
    page: number;
    limit: number;
    skip: number;
    sortBy: "createdAt" | "name" | "email";
    sortOrder: "asc" | "desc";
    search?: string;
}

export interface PaginatedUsers {
    data: Omit<User, "password">[];
    total: number;
}

const ALLOWED_SORT_FIELDS = ["createdAt", "name", "email"] as const;

const getAllUsers = async (params: UserPaginationParams): Promise<PaginatedUsers> => {
    const { skip, limit, sortBy, sortOrder, search } = params;

    const where: Record<string, unknown> = {};

    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
        ];
    }

    const orderBy: Record<string, "asc" | "desc"> = {};
    if (ALLOWED_SORT_FIELDS.includes(sortBy as typeof ALLOWED_SORT_FIELDS[number])) {
        orderBy[sortBy] = sortOrder;
    } else {
        orderBy.createdAt = "desc";
    }

    const [data, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                emailVerified: true,
                image: true,
                createdAt: true,
                updatedAt: true,
            },
        }),
        prisma.user.count({ where }),
    ]);

    return { data, total };
};

const getUserById = async (id: User["id"]) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            name: true,
        },
    });
    return user;
};

const updateUser = async (id: User["id"], data: Partial<User>) => {
    const user = await prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            role: true,
            emailVerified: true,
        },
    });
    return user;
};

const deleteUser = async (id: User["id"]) => {
    const user = await prisma.user.delete({
        where: { id },
    });
    return user;
};

export default {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
