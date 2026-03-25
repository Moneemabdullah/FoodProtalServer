import { Router } from "express";
import categoryController from "./category.controller.js";
import { Role } from "@prisma/client";
import { auth } from "../../middlewares/auth.js";

const router = Router();

router.post("/", auth(Role.ADMIN), categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.patch("/:id", auth(Role.ADMIN), categoryController.updateCategory);
router.delete("/:id", auth(Role.ADMIN), categoryController.deleteCategory);

export default router;
