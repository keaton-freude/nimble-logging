import { LogLevel } from "./log-level";

/**
 * LogContext is all of the information given by the user when they
 * call a log method.
 */

// This will let us easily encapsulate all of the information available
// to the log formatter. Some is created by user-invocation (such as log-level
// and message), while others are created internally (time-stamp)
export interface LogContext {
    // What time was this log received?
    timestamp: Date;
    // What level was this log?
    loglevel: LogLevel;
    // What was the log message?
    message: string;
    // Who was the source of the message?
    source: string;
}
