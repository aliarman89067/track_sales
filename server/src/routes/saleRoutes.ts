import express from "express";
import { addNewSale } from "../controllers/saleController";

const router = express.Router();

router.post("/", addNewSale)

export default router;
