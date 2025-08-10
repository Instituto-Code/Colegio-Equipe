import winston from 'winston';
import config from 'config';

//Levels de logger
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

//Especificando o tipo de level development ou production
const level = () => {
  const env = config.get<string>('env') || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

//Definindo cores do Logger
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

//Formatando as informações do Logger
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} - ${info.level} - ${info.message}`,
  ),
);

//Local de salvamento dos loggs
const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.logs',
    level: 'error',
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
];

const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default Logger;
