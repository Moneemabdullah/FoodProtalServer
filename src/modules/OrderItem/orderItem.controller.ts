import type { NextFunction, Request, Response } from "express";
import type { OrderItem } from "../../../generated/prisma/client";
import orderItemService from "./orderItem.service";

const createOrderItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const payload = req.body as OrderItem;
        const orderItem = await orderItemService.createOrderItem(payload);

        return res.status(201).json({
            success: true,
            message: "Order item created successfully",
            data: orderItem,
        });
    } catch (err) {
        next(err);
    }
};

const getAllOrderItems = async (
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const orderItems = await orderItemService.getAllOrderItems();

        return res.status(200).json({
            success: true,
            message: "Order items fetched successfully",
            data: orderItems,
        });
    } catch (err) {
        next(err);
    }
};

const getOrderItemById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
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
    } catch (err) {
        next(err);
    }
};

const updateOrderItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
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
    } catch (err) {
        next(err);
    }
};

const deleteOrderItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
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
    } catch (err) {
        next(err);
    }
};

export default {
    createOrderItem,
    getAllOrderItems,
    getOrderItemById,
    updateOrderItem,
    deleteOrderItem,
};
