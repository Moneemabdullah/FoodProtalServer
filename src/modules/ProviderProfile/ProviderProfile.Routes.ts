import { Router } from "express";
import providerProfileController from "./ProviderProfile.Controller";

const router = Router();

router.post("/", providerProfileController.createProviderProfile);
router.get("/", providerProfileController.getAllProviderProfiles);
router.get("/:id", providerProfileController.getProviderProfileById);
router.patch("/:id", providerProfileController.updateProviderProfile);
router.delete("/:id", providerProfileController.deleteProviderProfile);
router.post("/:providerId/rate", providerProfileController.rateProvider);

export default router;
