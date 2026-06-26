module.exports = (req, res, next) => {

    const start = Date.now();

    res.on("finish", () => {

        const time = Date.now() - start;

        console.log({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            responseTime: `${time} ms`,
            timestamp: new Date().toISOString()
        });

    });

    next();
};