import { Router } from "express";
import orderController from "./order.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth, authenticated } from "../../middlewares/auth";

const router = Router();

router.post("/", authenticated, orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.patch("/:id", authenticated, orderController.updateOrder);
router.delete("/:id", auth(Role.ADMIN), orderController.deleteOrder);
router.patch("/:id/status", auth(Role.PROVIDER), orderController.updateOrderStatus);

export default router;
