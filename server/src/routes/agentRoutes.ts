import express from "express";
import {
  // getAgent,
  // createAgent,
  // updateAgent,
  loginAgent,
  createAgent,
  verifyAgent,
  resendCode,
  getAgent,
} from "../controllers/agentController";
import { authMiddleware } from "../middleware.ts/authMiddleware";

const router = express.Router();

// router.get("/:cognitoId", getAgent);
// router.post("/", createAgent);
// router.put("/:cognitoId", updateAgent);
router.get("/", authMiddleware(["agent"]), getAgent);
router.get("/:email", loginAgent);
router.post("/", createAgent);
router.put("/verify", verifyAgent);
router.put("/resend-code", resendCode);

export default router;
