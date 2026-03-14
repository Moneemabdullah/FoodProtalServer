import { Router } from "express";
import userController from "./user.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.patch(
    "/:id",
    auth(Role.ADMIN, Role.PROVIDER, Role.CUSTOMER),
    userController.updateUser,
);
router.delete("/:id", auth(Role.ADMIN), userController.deleteUser);

export default router;
