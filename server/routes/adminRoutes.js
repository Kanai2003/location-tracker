import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  getUserAllLocations,
  getUsers,
  getUserCurrentLocation,
} from "../controllers/adminController.js";
import { registerAdminUser } from "../controllers/adminController.js";

const router = Router();

router.get("/users", authenticate, getUsers);
router.get("/user/:id/all-locations", authenticate, getUserAllLocations);
router.get("/user/:id/location", authenticate, getUserCurrentLocation);
// this is for admin registration and only for testing purpose
router.post("/register-admin", registerAdminUser);

export default router;
