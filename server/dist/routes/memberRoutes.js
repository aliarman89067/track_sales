"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const memberController_1 = require("../controllers/memberController");
const authMiddleware_1 = require("../middleware.ts/authMiddleware");
const router = express_1.default.Router();
router.post("/", memberController_1.createMembers);
router.get("/:memberId", (0, authMiddleware_1.authMiddleware)(["admin", "agent"]), memberController_1.getMember);
router.post("/add-leave", memberController_1.addLeave);
exports.default = router;
