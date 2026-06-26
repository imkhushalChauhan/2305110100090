const express = require("express");

const app = express();

app.use(express.json());

const logger = require("./middleware/login");
app.use(logger);

const notificationRoutes = require("./routes/notificationRoutes");
app.use("/notifications", notificationRoutes);

module.exports = app;