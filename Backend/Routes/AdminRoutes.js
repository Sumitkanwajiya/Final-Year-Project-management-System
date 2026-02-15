import express from 'express';
import { isAuthenticated, isAuthorized } from '../middleware/authMiddleware.js';
import {
    createStudent,
    createTeacher,
    updateStudent,
    deleteStudent,
    getStudentById,
    updateTeacher,
    deleteTeacher,
    getAllUsers,
    getAllProjects,
    getDashboardStats,
    assignSupervisor,
    getPendingSupervisorRequests,
    approveSupervisorRequest,
    rejectSupervisorRequest,
    approveProject,
    rejectProject
} from '../controllers/adminController.js';

const router = express.Router();

router.post("/create-student",
    isAuthenticated,
    isAuthorized("Admin"),
    createStudent);



router.put("/update-student/:id",
    isAuthenticated,
    isAuthorized("Admin"),
    updateStudent);

router.delete("/delete-student/:id",
    isAuthenticated,
    isAuthorized("Admin"),
    deleteStudent);

router.get("/get-user/:id",
    isAuthenticated,
    isAuthorized("Admin"),
    getStudentById);

router.post("/create-teacher",
    isAuthenticated,
    isAuthorized("Admin"),
    createTeacher);

router.put("/update-teacher/:id",
    isAuthenticated,
    isAuthorized("Admin"),
    updateTeacher);

router.delete("/delete-teacher/:id",
    isAuthenticated,
    isAuthorized("Admin"),
    deleteTeacher);

router.get("/get-all-users",
    isAuthenticated,
    isAuthorized("Admin"),
    getAllUsers);

router.get("/get-all-projects",
    isAuthenticated,
    isAuthorized("Admin"),
    getAllProjects);

router.get("/dashboard-stats",
    isAuthenticated,
    isAuthorized("Admin"),
    getDashboardStats);

router.post("/assign-supervisor",
    isAuthenticated,
    isAuthorized("Admin"),
    assignSupervisor);

router.get("/supervisor-requests",
    isAuthenticated,
    isAuthorized("Admin"),
    getPendingSupervisorRequests);

router.post("/approve-supervisor-request/:id",
    isAuthenticated,
    isAuthorized("Admin"),
    approveSupervisorRequest);

router.post("/reject-supervisor-request/:id",
    isAuthenticated,
    isAuthorized("Admin"),
    rejectSupervisorRequest);

router.put("/projects/:id/approve",
    isAuthenticated,
    isAuthorized("Admin"),
    approveProject);

router.put("/projects/:id/reject",
    isAuthenticated,
    isAuthorized("Admin"),
    rejectProject);

export default router;