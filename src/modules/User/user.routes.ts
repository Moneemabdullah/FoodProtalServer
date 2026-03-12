import { Router } from "express";
import { authenticated } from "../../middlewares/auth";
import userController from "./user.controller";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.patch("/:id", authenticated, userController.updateUser);
router.delete("/:id", authenticated, userController.deleteUser);

export default router;
