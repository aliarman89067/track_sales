import express from "express";
import {
  createMembers,
  getMember,
  addLeave,
} from "../controllers/memberController";
import { authMiddleware } from "../middleware.ts/authMiddleware";

const router = express.Router();

router.post("/", createMembers);
router.get("/:memberId", authMiddleware(["admin", "agent"]), getMember);
router.post("/add-leave", addLeave);

export default router;
