import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getTaskStats, getGroupStats } from "../controllers/statsController.js";

const router = express.Router();

// Protéger toutes les routes
router.use(authenticate);

router.get("/tasks", getTaskStats);
router.get("/groups", getGroupStats);

export default router;
