import { User } from "../../../generated/prisma/client";
import prisma from "../../config/db";
// import { auth } from "../../lib/auth";

const getAllUsers = async () => {
    const appUsers = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            role: true,
            emailVerified: true,
        },
    });
    return appUsers;
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
