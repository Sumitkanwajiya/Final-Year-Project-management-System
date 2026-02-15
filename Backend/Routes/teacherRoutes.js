import express from "express";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js";
import { getTeacherDashboardStats, getRequests, acceptRequest, rejectRequest, getAssignedStudents, addFeedback, markComplete, getTeacherFiles, downloadFile } from "../controllers/teacherController.js";

const router = express.Router();

router.get("/dashboard-stats", isAuthenticated, isAuthorized("Teacher"), getTeacherDashboardStats);

router.get("/requests", isAuthenticated, isAuthorized("Teacher"), getRequests);

router.put("/requests/:requestId/accept", isAuthenticated, isAuthorized("Teacher"), acceptRequest);

router.put("/requests/:requestId/reject", isAuthenticated, isAuthorized("Teacher"), rejectRequest);


router.get("/assigned-students", isAuthenticated, isAuthorized("Teacher"), getAssignedStudents);
router.post("/projects/:projectId/feedback", isAuthenticated, isAuthorized("Teacher"), addFeedback);
router.put("/projects/:projectId/complete", isAuthenticated, isAuthorized("Teacher"), markComplete);

router.get("/files", isAuthenticated, isAuthorized("Teacher"), getTeacherFiles);
router.get("/projects/:projectId/files/:fileId/download", isAuthenticated, isAuthorized("Teacher"), downloadFile);

export default router;