import express from "express";
import {
    getStudentProject,
    submitProposal,
    uploadFile,
    getAvailableSupervisors,
    getSupervisor,
    requestSupervisorChange,
    dashboardStats,
    getFeedback,
    downloadFile,
    viewFile
} from "../controllers/studentController.js";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js";
import { upload, handleMulterError } from "../middleware/upload.js";

const router = express.Router();

// Project Routes
router.get("/project", isAuthenticated, isAuthorized("Student"), getStudentProject);
router.post("/project-proposal", isAuthenticated, isAuthorized("Student"), submitProposal);
router.post("/project-upload/:projectId", isAuthenticated, isAuthorized("Student"), upload.fields([
    { name: 'reportFile', maxCount: 1 },
    { name: 'presentationFile', maxCount: 1 },
    { name: 'codeFiles', maxCount: 5 }
]), handleMulterError, uploadFile);

// Supervisor Routes
router.get("/fetch-supervisors", isAuthenticated, isAuthorized("Student"), getAvailableSupervisors);
router.get("/supervisor", isAuthenticated, isAuthorized("Student"), getSupervisor);
router.post("/supervisor-change", isAuthenticated, isAuthorized("Student"), requestSupervisorChange);

// Feedback Routes
router.get("/feedback/:projectId", isAuthenticated, isAuthorized("Student"), getFeedback);
router.get("/fetch-dashboard-stats", isAuthenticated, isAuthorized("Student"), dashboardStats);
router.get("/download-file/:projectId/:fileId", isAuthenticated, isAuthorized("Student"), downloadFile);
router.get("/view-file/:projectId/:fileId", isAuthenticated, isAuthorized("Student"), viewFile);



export default router;