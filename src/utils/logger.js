const { createLogger, transports, format } = require('winston');
const path = require('path');

// Definir niveles de logging
const levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4
};

// Configuración del logger
const logger = createLogger({
    levels: levels,
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        // Consola para desarrollo (debug en adelante)
        new transports.Console({
            level: 'debug',
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        }),
        // Archivo para errores (error en adelante)
        new transports.File({
            filename: path.join(__dirname, '../logs/errors.log'),
            level: 'error'
        })
    ]
});


module.exports = logger;