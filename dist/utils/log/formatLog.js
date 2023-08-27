const formatLog = (req, message) => {
    return `[${req.method} ${req.originalUrl}] ${message}`;
};
export default formatLog;
