import express from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import { isTokenValid } from "../middlewares/authMiddleware.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes publiques
router.post("/register", register);
router.post("/login", login);

// Route protégée
router.get("/profile", authenticate, getProfile);
//Route pour verifier la validité du token
router.post("/verify", authenticate, isTokenValid);

export default router;
