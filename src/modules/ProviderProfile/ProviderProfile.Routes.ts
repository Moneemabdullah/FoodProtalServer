import { Router } from "express";
import providerProfileController from "./ProviderProfile.Controller";
import { Role } from "../../../generated/prisma/enums";
import { auth, authenticated } from "../../middlewares/auth";

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
    providerProfileController.updateProviderProfile,
);
router.delete(
    "/:id",
    auth(Role.PROVIDER),
    providerProfileController.deleteProviderProfile,
);
router.post(
    "/:providerId/rate",
    authenticated,
    providerProfileController.rateProvider,
);

export default router;
