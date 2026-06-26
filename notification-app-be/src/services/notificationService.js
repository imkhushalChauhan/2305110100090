const { v4: uuid } = require("uuid");

const notifications = [];

exports.create = (data) => {

    const notification = {
        id: uuid(),
        ...data
    };

    notifications.push(notification);

    return notification;
};

exports.getAll = () => notifications;