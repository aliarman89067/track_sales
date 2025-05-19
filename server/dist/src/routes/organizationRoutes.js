"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const organizationController_1 = require("../controllers/organizationController");
const router = express_1.default.Router();
router.get("/:adminCognitoId", organizationController_1.getOrganizations);
router.get("/members/:adminCognitoId", organizationController_1.getOrganizationsWithMembers);
router.get("/:organizationId/:adminCognitoId", organizationController_1.getOrganizationName);
router.post("/", organizationController_1.createOrganization);
router.get("/members/:organizationId/:adminCognitoId", organizationController_1.getOrganizationMembers);
router.post("/update", organizationController_1.updateOrganization);
router.delete("/delete/:organizationId", organizationController_1.deleteOrganization);
router.post("/get-agent", organizationController_1.getAgentOrganizations);
exports.default = router;
