import express from "express";
import {
  getAgent,
  createAgent,
  updateAgent,
} from "../controllers/agentController";

const router = express.Router();

router.get("/:cognitoId", getAgent);
router.post("/", createAgent);
router.put("/:cognitoId", updateAgent);

export default router;
