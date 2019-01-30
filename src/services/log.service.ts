import * as path from 'path';
import * as winston from 'winston';

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            name: 'console',
        }),
        new (winston.transports.File)({
            name: 'info-file',
            filename: path.join(process.cwd(), 'log', 'info.log'),
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: path.join(process.cwd(), 'log', 'errors.log'),
            level: 'error'
        })
    ]
});

export class LogService {

    constructor(private environment: string) {
    }

    info(...attrs) {
        const [message, ...args] = attrs;

        logger.info(`${this.environment}:`, message, args);
    }

    error(error: Error) {
        logger.error(`${this.environment}:`, error.name, error.message, error.stack);
    }
}

export default logger;
