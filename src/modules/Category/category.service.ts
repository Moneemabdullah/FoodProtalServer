import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (data: Category) => {
    const category = await prisma.category.create({
        data,
    });
    return category;
};

const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        include: {
            meals: true,
        },
    });
    return categories;
};

const getCategoryById = async (id: Category["id"]) => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: {
            meals: true,
        },
    });
    return category;
};

const updateCategory = async (id: Category["id"], data: Partial<Category>) => {
    const category = await prisma.category.update({
        where: { id },
        data,
    });
    return category;
};

const deleteCategory = async (id: Category["id"]) => {
    const category = await prisma.category.delete({
        where: { id },
    });
    return category;
};

export default {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
