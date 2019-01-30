import * as expressWinston from 'express-winston';
import * as path from 'path';
import * as winston from 'winston';

const logger = new winston.Logger({
    level: 'info',
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            timestamp: () => new Date().toString(),
            formatter: (options) => {
                // - Return string will be passed to logger.
                // - Optionally, use options.colorize(options.level, <string>) to
                //   colorize output based on the log level.
                return options.timestamp() + ': ' +
                    winston.config.colorize(options.level, options.level.toUpperCase()) + ' ' +
                    (options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
            }
        }),
        new winston.transports.File({
            json: true,
            filename: path.join(process.cwd(), 'log', 'info.log')
        })
    ]
});

const ExpressWinstonTransports: any[] = [
    new winston.transports.Console({
        json: true,
        colorize: true
    })
];

if (process.env.NODE_ENV === 'production') {
    ExpressWinstonTransports.push(
        new winston.transports.File({filename: path.join(process.cwd(), 'log', 'access.log')})
    );
}

export const expressLogger = expressWinston.logger({
    transports: ExpressWinstonTransports,
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
});

export class LoggerService {

    public expressLogger: any;

    constructor(private environment: string) {
    }

    info(...attrs) {
        const [message, ...args] = attrs;

        logger.log('info', `${this.environment}:`, message, ...args);
    }

    error(error: Error) {
        logger.error(`${this.environment}:`, error.name, error.message, error.stack);
    }
}

export default logger;
