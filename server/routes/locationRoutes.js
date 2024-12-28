import { Router } from "express";
import { trackLocation } from "../controllers/locationController.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/", authenticate, trackLocation);

export default router;
