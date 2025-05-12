import express from "express";
import {
  createOrganization,
  getOrganizations,
  getOrganizationName,
  getOrganizationMembers,
  updateOrganization,
} from "../controllers/organizationController";

const router = express.Router();

router.get("/:adminCognitoId", getOrganizations);
router.get("/:organizationId/:adminCognitoId", getOrganizationName);
router.post("/", createOrganization);
router.get("/members/:organizationId/:adminCognitoId", getOrganizationMembers);
router.post("/update", updateOrganization);

export default router;
