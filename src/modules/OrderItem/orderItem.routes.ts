import { Router } from "express";
import orderItemController from "./orderItem.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.CUSTOMER), orderItemController.createOrderItem);
router.get("/", orderItemController.getAllOrderItems);
router.get("/:id", orderItemController.getOrderItemById);
router.patch("/:id", auth(Role.CUSTOMER), orderItemController.updateOrderItem);
router.delete("/:id", auth(Role.CUSTOMER), orderItemController.deleteOrderItem);

export default router;
