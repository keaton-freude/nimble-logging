import { ILoggerSink } from "../sink/sink";
import { LogLevel } from "./log-level";
import { ILogFormatter } from "./log-formatter";
import { LogContext } from "./log-context";

/**
 * A client is the user-facing public API for creating new log messages
 *
 * Clients support log levels (and maybe categories at some point).
 *
 * Logs created via the client are sent to _sinks_ which can be controlled
 * when creating your logger instance
 *
 * Hierarchy for log levels, from most noisy to least
 * DEBUG
 * INFO
 * WARNING
 * ERROR
 * FATAL
 */

export interface ClientSettings {
    sinks: Array<ILoggerSink>;
    formatter: ILogFormatter;
}

export abstract class ILoggerClient {
    // Currently just support sending strings, users are expected to transform their messages
    // into the appropriate string before calling the client using something like back-tick syntax
    // or building their strings manually
    abstract Debug(message: string): Promise<void>;
    abstract Info(message: string): Promise<void>;
    abstract Warning(message: string): Promise<void>;
    abstract Error(message: string): Promise<void>;
    abstract Fatal(message: string): Promise<void>;

    abstract AddSink(sink: ILoggerSink): void;

    protected _settings: ClientSettings;

    constructor(settings: ClientSettings) {
        this._settings = settings;
    }
}

export class Logger extends ILoggerClient {
    AddSink(sink: ILoggerSink): void {
        this._settings.sinks.push(sink);
    }
    async Debug(message: string): Promise<void> {
        // Build the context, format the log then sink it
        const context = {
            timestamp: new Date(),
            loglevel: LogLevel.Debug,
            message: message,
            source: "Source",
        } as LogContext;

        const formattedMessage = this._settings.formatter.format(context);

        this._settings.sinks.forEach(sink => {
            return sink.SinkLog(formattedMessage);
        });
    }
    async Warning(message: string): Promise<void> {
        // Build the context, format the log then sink it
        const context = {
            timestamp: new Date(),
            loglevel: LogLevel.Warning,
            message: message,
            source: "Source",
        } as LogContext;

        const formattedMessage = this._settings.formatter.format(context);

        this._settings.sinks.forEach(sink => {
            return sink.SinkLog(formattedMessage);
        });
    }
    async Error(message: string): Promise<void> {
        // Build the context, format the log then sink it
        const context = {
            timestamp: new Date(),
            loglevel: LogLevel.Error,
            message: message,
            source: "Source",
        } as LogContext;

        const formattedMessage = this._settings.formatter.format(context);

        this._settings.sinks.forEach(sink => {
            return sink.SinkLog(formattedMessage);
        });
    }
    async Fatal(message: string): Promise<void> {
        // Build the context, format the log then sink it
        const context = {
            timestamp: new Date(),
            loglevel: LogLevel.Fatal,
            message: message,
            source: "Source",
        } as LogContext;

        const formattedMessage = this._settings.formatter.format(context);

        this._settings.sinks.forEach(sink => {
            return sink.SinkLog(formattedMessage);
        });
    }
    async Info(message: string): Promise<void> {
        // Build the context, format the log then sink it
        const context = {
            timestamp: new Date(),
            loglevel: LogLevel.Info,
            message: message,
            source: "Source",
        } as LogContext;

        const formattedMessage = this._settings.formatter.format(context);

        this._settings.sinks.forEach(sink => {
            return sink.SinkLog(formattedMessage);
        });
    }
}
