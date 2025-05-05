import express from "express";
import {
  createOrganization,
  getOrganizations,
  getOrganizationName,
  getOrganizationMembers,
} from "../controllers/organizationController";

const router = express.Router();

router.get("/:adminCognitoId", getOrganizations);
router.get("/:organizationId/:adminCognitoId", getOrganizationName);
router.post("/", createOrganization);
router.put("/:adminCognitoId", (req, res) => {});
router.get("/members/:organizationId/:adminCognitoId", getOrganizationMembers);

export default router;
