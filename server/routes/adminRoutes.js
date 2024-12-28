import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  getUserAllLocations,
  getUsers,
  getUserCurrentLocation,
} from "../controllers/adminController.js";

const router = Router();

router.get("/users", authenticate, getUsers);
router.get("/user/:id/all-locations", authenticate, getUserAllLocations);
router.get("/user/:id/location", authenticate, getUserCurrentLocation);

export default router;
