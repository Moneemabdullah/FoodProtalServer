import { Order, OrderStatus } from "../../../generated/prisma/client";
import prisma from "../../lib/prisma";

interface CreateOrderInput {
    userId: string;
    totalAmount: number;
    items: Array<{
        mealId: string;
        quantity: number;
        price: number;
    }>;
}

const createOrder = async (data: CreateOrderInput) => {
    const order = await prisma.order.create({
        data: {
            userId: data.userId,
            totalAmount: data.totalAmount,
            orderItems: {
                create: data.items.map((item) => ({
                    mealId: item.mealId,
                    quantity: item.quantity,
                    price: item.price,
                })),
            },
        },
        include: {
            orderItems: true,
            user: true,
        },
    });
    return order;
};

interface GetAllOrdersParams {
    userId?: string;
    status?: OrderStatus;
}

const getAllOrders = async (params?: GetAllOrdersParams) => {
    const where: { userId?: string; status?: OrderStatus } = {};
    if (params?.userId) where.userId = params.userId;
    if (params?.status) where.status = params.status;

    const orders = await prisma.order.findMany({
        where,
        include: {
            user: true,
            orderItems: {
                include: {
                    meal: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return orders;
};

const getOrdersByProvider = async (providerId: string) => {
    const orders = await prisma.order.findMany({
        where: {
            orderItems: {
                some: {
                    meal: {
                        providerId,
                    },
                },
            },
        },
        include: {
            user: true,
            orderItems: {
                include: {
                    meal: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return orders;
};

const getOrderById = async (id: Order["id"]) => {
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: true,
            orderItems: {
                include: {
                    meal: true,
                },
            },
        },
    });
    return order;
};

const updateOrder = async (id: Order["id"], data: Partial<Order>) => {
    const order = await prisma.order.update({
        where: { id },
        data,
    });
    return order;
};

const deleteOrder = async (id: Order["id"]) => {
    const order = await prisma.order.delete({
        where: { id },
    });
    return order;
};

const updateOrderStatus = async (id: Order["id"], status: OrderStatus) => {
    const order = await prisma.order.update({
        where: { id },
        data: { status },
    });
    return order;
};

export default {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    getOrdersByProvider,
};
