import express from "express";
import {
  createMembers,
  getMember,
  addLeave,
  updateMember,
  deleteMember,
} from "../controllers/memberController";
import { authMiddleware } from "../middleware.ts/authMiddleware";

const router = express.Router();

router.post("/", createMembers);
router.get("/:memberId", authMiddleware(["admin", "agent"]), getMember);
router.post("/add-leave", addLeave);
router.put("/update", authMiddleware(["admin"]), updateMember);
router.delete("/delete/:memberId", authMiddleware(["admin"]), deleteMember);

export default router;
