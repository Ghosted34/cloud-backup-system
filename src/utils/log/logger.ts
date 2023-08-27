import { format, createLogger, transports, addColors, Logger } from "winston";

const nodeEnv: any = process.env.NODE_ENV;

const logger: Logger = createLogger({
  transports: [new transports.Console({ silent: nodeEnv === "test" })],
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.padLevels(),
    format.printf((info: any) =>
      format
        .colorize()
        .colorize(
          info.level,
          `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`
        )
    )
  ),
});

addColors({
  error: "bold red",
  warn: "bold yellow",
  info: "bold cyan",
  debug: "bold green",
});

export default logger;
