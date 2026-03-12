import { Router } from "express";
import orderItemController from "./orderItem.controller";
import { authenticated } from "../../middlewares/auth";

const router = Router();

router.post("/", authenticated, orderItemController.createOrderItem);
router.get("/", orderItemController.getAllOrderItems);
router.get("/:id", orderItemController.getOrderItemById);
router.patch("/:id", authenticated, orderItemController.updateOrderItem);
router.delete("/:id", authenticated, orderItemController.deleteOrderItem);

export default router;
