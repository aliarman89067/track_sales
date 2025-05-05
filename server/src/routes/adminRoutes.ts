import express from "express";
import {
  createAdmin,
  getAdmin,
  updateAdmin,
} from "../controllers/adminController";

const router = express.Router();

router.get("/:cognitoId", getAdmin);
router.post("/", createAdmin);
router.put("/:cognitoId", updateAdmin);

export default router;
