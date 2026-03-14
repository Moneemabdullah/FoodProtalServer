import { Router } from "express";
import orderController from "./order.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/", auth(Role.CUSTOMER), orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.patch("/:id", auth(Role.CUSTOMER), orderController.updateOrder);
router.delete("/:id", auth(Role.ADMIN), orderController.deleteOrder);
router.patch(
    "/:id/status",
    auth(Role.PROVIDER),
    orderController.updateOrderStatus,
);
router.get(
    "/provider/:providerId",
    auth(Role.PROVIDER),
    orderController.getOrdersByProvider,
);

export default router;
