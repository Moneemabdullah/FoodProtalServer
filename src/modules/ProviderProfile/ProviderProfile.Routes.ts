import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { uploadMiddleware } from "../../middlewares/upload.middleware";
import providerProfileController from "./ProviderProfile.Controller";

const router = Router();

router.post(
    "/",
    auth(Role.PROVIDER),
    providerProfileController.createProviderProfile,
);
router.get("/", providerProfileController.getAllProviderProfiles);
router.get("/:id", providerProfileController.getProviderProfileById);
router.patch(
    "/:id",
    auth(Role.PROVIDER),
    uploadMiddleware.single("image"),
    providerProfileController.updateProviderProfile,
);
router.delete(
    "/:id",
    auth(Role.PROVIDER),
    providerProfileController.deleteProviderProfile,
);
router.post(
    "/:providerId/rate",
    auth(Role.CUSTOMER),
    providerProfileController.rateProvider,
);

export default router;
