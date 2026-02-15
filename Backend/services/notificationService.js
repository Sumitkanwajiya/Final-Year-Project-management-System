import Notification from "../models/notification.js";

export const createNotification = async (notificationData) => {
    const notification = new Notification(notificationData);
    return await notification.save();
};

export const notifyUser = async (
    userId,
    message,
    type = "general",
    link = null,
    priority = "low"
) => {
    return await createNotification({
        user: userId,
        message,
        type,
        link,
        priority
    });
};

export const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOneAndUpdate({
        _id: notificationId,
        user: userId
    },
        {
            isRead: true
        },
        {
            new: true
        });
    if (!notification) {
        throw new Error("Notification not found");
    }
    return notification;
};

export const markAllAsRead = async (userId) => {
    const notification = await Notification.updateMany({
        user: userId,
        isRead: false
    },
        {
            isRead: true
        });
    if (!notification) {
        throw new Error("Notification not found");
    }
    return notification;
};

export const deleteNotification = async (notificationId, userId) => {
    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        user: userId
    });
    if (!notification) {
        throw new Error("Notification not found");
    }
    return notification;
};
