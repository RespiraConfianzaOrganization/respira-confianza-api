const { createLogger, format, transports } = require('winston');
require("dotenv").config();
const NODE_ENV = process.env.NODE_ENV;

// Logger
module.exports = createLogger({
    level: NODE_ENV === 'development' ? 'debug' : 'info',
    format: format.combine(
        NODE_ENV === 'development' ? format.colorize() : format.uncolorize(),
        format.simple(),
        format.timestamp(),
        format.printf(info => `[${info.timestamp}] ${info.message}`),
    ),
    transports: [
        new transports.File({ filename: 'combined.log' })
    ]
})