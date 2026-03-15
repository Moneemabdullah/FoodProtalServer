import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { uploadMiddleware } from "../../middlewares/upload.middleware";
import userController from "./user.controller";

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
