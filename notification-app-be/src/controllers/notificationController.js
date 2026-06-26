const Log = require("../utils/logger");
const service = require("../services/notificationService");

exports.createNotification = async (req, res) => {
    try {
        await Log(
            "backend",
            "info",
            "controller",
            "Creating a new notification"
        );

        const notification = service.create(req.body);

        await Log(
            "backend",
            "info",
            "service",
            "Notification created successfully"
        );

        res.status(201).json(notification);
    } catch (error) {
        await Log(
            "backend",
            "error",
            "handler",
            error.message
        );

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        await Log(
            "backend",
            "info",
            "controller",
            "Fetching all notifications"
        );

        const notifications = service.getAll();

        res.json(notifications);
    } catch (error) {
        await Log(
            "backend",
            "error",
            "handler",
            error.message
        );

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};