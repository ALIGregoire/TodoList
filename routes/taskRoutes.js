import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  createTask,
  getTasks,
  getTaskByGroupId,
  updateTask,
  deleteTask,
  completeTask,
} from "../controllers/taskController.js";

const router = express.Router();

// Protéger toutes les routes
router.use(authenticate);

router.route("/").post(createTask).get(getTasks);

router.route("/:id").get(getTaskByGroupId).put(updateTask).delete(deleteTask);

router.put("/:id/complete", completeTask);

export default router;
