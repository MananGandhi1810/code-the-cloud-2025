import {Router } from "express";
import {
    createProjectHandler,
    getProjectsHandler,
    getProjectByIdHandler,
    getProjectStatusHandler,
    getProjectSchemaHandler,
    updateProjectSchemaHandler,
    approveProjectSchemaHandler,
    getProjectCodeHandler
} from "../handlers/project.js";
import { checkAuth } from "../middlewares/auth.js";

var router = Router();

router.use(checkAuth);
router.post("/", createProjectHandler);
router.get("/", getProjectsHandler);
router.get("/:projectId", getProjectByIdHandler);
router.get("/:projectId/status", getProjectStatusHandler);
router.get("/:projectId/schema", getProjectSchemaHandler);
router.put("/:projectId/schema", updateProjectSchemaHandler);
router.post("/:projectId/schema/approve", approveProjectSchemaHandler);
router.get("/:projectId/code", getProjectCodeHandler);

export default router;