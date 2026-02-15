import express from "express";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from "../controllers/notificationController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getNotifications);
router.put("/markAsRead/:id", isAuthenticated, markAsRead);
router.put("/markAllAsRead", isAuthenticated, markAllAsRead);
router.delete("/deleteNotification/:id", isAuthenticated, deleteNotification);

export default router;
