const service = require("../services/notificationService");

exports.createNotification = (req, res) => {

    const notification = service.create(req.body);

    res.status(201).json(notification);
};

exports.getNotifications = (req, res) => {

    res.json(service.getAll());

};