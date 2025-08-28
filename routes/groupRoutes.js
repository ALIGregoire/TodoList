import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  createGroup,
  getGroups,
  updateGroup,
  deleteGroup,
} from "../controllers/groupController.js";

const router = express.Router();

// Protéger toutes les routes
router.use(authenticate);

router.route("/").post(createGroup).get(getGroups);

router.route("/:id").put(updateGroup).delete(deleteGroup);

export default router;
