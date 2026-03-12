import type { Request, Response } from "express";
import type { Order, OrderStatus } from "../../../generated/prisma/client";
import orderService from "./order.service";

const createOrder = async (req: Request, res: Response) => {
    try {
        const payload = req.body as {
            userId: string;
            totalAmount: number;
            items: Array<{
                mealId: string;
                quantity: number;
                price: number;
            }>;
        };
        const order = await orderService.createOrder(payload);

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to create order",
        });
    }
};

const getAllOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string | undefined;
        const status = req.query.status as OrderStatus | undefined;
        
        const queryParams: { userId?: string; status?: OrderStatus } = {};
        if (userId) queryParams.userId = userId;
        if (status) queryParams.status = status;
        
        const orders = await orderService.getAllOrders(queryParams);

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
        });
    }
};

const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order id",
            });
        }

        const order = await orderService.getOrderById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            data: order,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch order",
        });
    }
};

const updateOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order id",
            });
        }

        const payload = req.body as Partial<Order>;
        const order = await orderService.updateOrder(id, payload);

        return res.status(200).json({
            success: true,
            message: "Order updated successfully",
            data: order,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to update order",
        });
    }
};

const deleteOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order id",
            });
        }

        await orderService.deleteOrder(id);

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully",
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to delete order",
        });
    }
};

const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order id",
            });
        }

        const { status } = req.body as { status: OrderStatus };
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required",
            });
        }

        const order = await orderService.updateOrderStatus(id, status);

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to update order status",
        });
    }
};

export default {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
};
