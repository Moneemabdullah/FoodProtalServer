import type { OrderItem } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

const createOrderItem = async (data: OrderItem) => {
    const orderItem = await prisma.orderItem.create({
        data,
    });
    return orderItem;
};

const getAllOrderItems = async () => {
    const orderItems = await prisma.orderItem.findMany({
        include: {
            order: true,
            meal: true,
        },
    });
    return orderItems;
};

const getOrderItemById = async (id: OrderItem["id"]) => {
    const orderItem = await prisma.orderItem.findUnique({
        where: { id },
        include: {
            order: true,
            meal: true,
        },
    });
    return orderItem;
};

const updateOrderItem = async (
    id: OrderItem["id"],
    data: Partial<OrderItem>,
) => {
    const orderItem = await prisma.orderItem.update({
        where: { id },
        data,
    });
    return orderItem;
};

const deleteOrderItem = async (id: OrderItem["id"]) => {
    const orderItem = await prisma.orderItem.delete({
        where: { id },
    });
    return orderItem;
};

export default {
    createOrderItem,
    getAllOrderItems,
    getOrderItemById,
    updateOrderItem,
    deleteOrderItem,
};
