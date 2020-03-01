import { LogLevel } from "./log-level";

/**
 * The ILogFormatter class is responsible for consuming information from
 * the ILoggerClient interface and formatting a final message to be sunk
 */

// Users can implement this interface to apply their own formatting logic
export interface ILogFormatter {
    format(message: string, logLevel: LogLevel): string;
}

export class BasicLogFormatter implements ILogFormatter {
    format(message: string, logLevel: LogLevel): string {
        // The most basic log formatter
        return `[${logLevel}] - ${message}`;
    }
}
