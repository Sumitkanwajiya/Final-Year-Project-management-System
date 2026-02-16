import express from "express";
import { createDeadline, getAllDeadlines } from "../controllers/deadlineController.js";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-deadline/:id", isAuthenticated, isAuthorized("Admin", "Teacher"), createDeadline);
router.get("/get-all-deadlines", isAuthenticated, isAuthorized("Admin", "Teacher"), getAllDeadlines);

export default router;
