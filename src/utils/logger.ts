import {createLogger, format, transports} from "winston";
import appRoot from 'app-root-path';

const logger = createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({stack: true}),
    format.splat(),
    format.prettyPrint()
  ),
  transports: [
    new transports.File({
      filename: appRoot.path + '/logs/error.log',
      level: 'error',
      maxFiles: 5,
      maxsize: 5242880
    }),
  ]
});

export default logger;

export const formatError = (error: any) => {
  logger.log('error', JSON.stringify({
    message: error.message, path: error.path, code: error.extensions.code
  }, null, 2));
  error.extensions.exception = undefined;
  return error;
}