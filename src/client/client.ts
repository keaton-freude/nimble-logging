/**
 * A client is the user-facing public API for creating new log messages
 *
 * Clients support log levels (and maybe categories at some point).
 *
 * Logs created via the client are sent to _sinks_ which can be controlled
 * when creating your logger instance
 */

export interface ILoggerClient {
  // Currently just support sending strings, users are expected to transform their messages
  // into the appropriate string before calling the client using something like back-tick syntax
  // or building their strings manually
  Info(message: string): void;
}

export class Logger {}
