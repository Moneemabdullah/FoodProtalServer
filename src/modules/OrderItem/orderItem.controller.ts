import type { Request, Response } from "express";
import type { OrderItem } from "../../../generated/prisma/client";
import orderItemService from "./orderItem.service";

const createOrderItem = async (req: Request, res: Response) => {
    try {
        const payload = req.body as OrderItem;
        const orderItem = await orderItemService.createOrderItem(payload);

        return res.status(201).json({
            success: true,
            message: "Order item created successfully",
            data: orderItem,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to create order item",
        });
    }
};

const getAllOrderItems = async (_req: Request, res: Response) => {
    try {
        const orderItems = await orderItemService.getAllOrderItems();

        return res.status(200).json({
            success: true,
            message: "Order items fetched successfully",
            data: orderItems,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch order items",
        });
    }
};

const getOrderItemById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order item id",
            });
        }

        const orderItem = await orderItemService.getOrderItemById(id);

        if (!orderItem) {
            return res.status(404).json({
                success: false,
                message: "Order item not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order item fetched successfully",
            data: orderItem,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch order item",
        });
    }
};

const updateOrderItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order item id",
            });
        }

        const payload = req.body as Partial<OrderItem>;
        const orderItem = await orderItemService.updateOrderItem(id, payload);

        return res.status(200).json({
            success: true,
            message: "Order item updated successfully",
            data: orderItem,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to update order item",
        });
    }
};

const deleteOrderItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order item id",
            });
        }

        await orderItemService.deleteOrderItem(id);

        return res.status(200).json({
            success: true,
            message: "Order item deleted successfully",
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to delete order item",
        });
    }
};

export default {
    createOrderItem,
    getAllOrderItems,
    getOrderItemById,
    updateOrderItem,
    deleteOrderItem,
};
