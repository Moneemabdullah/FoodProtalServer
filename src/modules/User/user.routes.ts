import { Router } from "express";
import { Role } from "@prisma/client";
import { auth } from "../../middlewares/auth.js";
import { uploadMiddleware } from "../../middlewares/upload.middleware.js";
import userController from "./user.controller.js";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.patch(
    "/:id",
    auth(Role.ADMIN, Role.PROVIDER, Role.CUSTOMER),
    uploadMiddleware.single("image"),
    userController.updateUser,
);
router.delete("/:id", auth(Role.ADMIN), userController.deleteUser);

export default router;
