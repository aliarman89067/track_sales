"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const agentController_1 = require("../controllers/agentController");
const router = express_1.default.Router();
router.get("/:cognitoId", agentController_1.getAgent);
router.post("/", agentController_1.createAgent);
router.put("/:cognitoId", agentController_1.updateAgent);
exports.default = router;
