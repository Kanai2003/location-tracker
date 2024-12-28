import { Router } from "express";
import { registerUser, loginUser, registerAdminUser } from "../controllers/userController.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// this is for admin registration and only for testing purpose
router.post("/register-admin", registerAdminUser);


export default router;
