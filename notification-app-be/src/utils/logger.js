const axios = require("axios");

const BASE_URL = "http://4.224.186.213/evaluation-service/logs";

async function Log(stack, level, packageName, message) {
    try {
        const response = await axios.post(BASE_URL, {
            stack,
            level,
            package: packageName,
            message,
        });

        return response.data;
    } catch (error) {
        console.error("Logging failed");

        if (error.response) {
            console.error(error.response.data);
        }
    }
}

module.exports = Log;