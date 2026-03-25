import { Router } from "express";
import locationController from "./location.controller";
import { Role } from "@prisma/client";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/", auth(Role.ADMIN), locationController.createLocation);
router.get("/", locationController.getAllLocations);
router.get("/:id", locationController.getLocationById);
router.patch("/:id", auth(Role.ADMIN), locationController.updateLocation);
router.delete("/:id", auth(Role.ADMIN), locationController.deleteLocation);

export default router;
