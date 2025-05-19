import express from "express";
import {
  createOrganization,
  getOrganizations,
  getOrganizationName,
  getOrganizationMembers,
  updateOrganization,
  getOrganizationsWithMembers,
  deleteOrganization,
  getAgentOrganizations,
} from "../controllers/organizationController";

const router = express.Router();

router.get("/:adminCognitoId", getOrganizations);
router.get("/members/:adminCognitoId", getOrganizationsWithMembers);
router.get("/:organizationId/:adminCognitoId", getOrganizationName);
router.post("/", createOrganization);
router.get("/members/:organizationId/:adminCognitoId", getOrganizationMembers);
router.post("/update", updateOrganization);
router.delete("/delete/:organizationId", deleteOrganization);
router.post("/get-agent", getAgentOrganizations);

export default router;
