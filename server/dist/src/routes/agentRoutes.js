"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const agentController_1 = require("../controllers/agentController");
const authMiddleware_1 = require("../middleware.ts/authMiddleware");
const router = express_1.default.Router();
// router.get("/:cognitoId", getAgent);
// router.post("/", createAgent);
// router.put("/:cognitoId", updateAgent);
router.get("/", (0, authMiddleware_1.authMiddleware)(["agent"]), agentController_1.getAgent);
router.get("/:email", agentController_1.loginAgent);
router.post("/", agentController_1.createAgent);
router.put("/verify", agentController_1.verifyAgent);
router.put("/resend-code", agentController_1.resendCode);
exports.default = router;
