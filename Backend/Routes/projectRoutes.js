import express from "express";
import { downloadFile, getAllProjects } from "../controllers/projectController.js";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",
    isAuthenticated,
    isAuthorized("Admin"), getAllProjects);

router.get("/download/:projectId/:fileId",
    isAuthenticated,
    downloadFile);

export default router;