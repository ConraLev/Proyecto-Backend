const { createLogger, transports, format } = require('winston');
const path = require('path');

const env = process.env.NODE_ENV || 'development';

const levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4
};

const logFormat = format.combine(
    format.timestamp(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

const logger = createLogger({
    levels: levels,
    format: logFormat,
    transports: [
        new transports.Console({
            level: env === 'dev' ? 'debug' : 'warn',
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        }),
        new transports.File({
            filename: path.join(__dirname, '../logs/errors.log'),
            level: 'error'
        })
    ]
});

if (env === 'prod') {
    logger.add(new transports.File({
        filename: path.join(__dirname, '../logs/combined.log'),
        level: 'info'
    }));
}

module.exports = logger;
