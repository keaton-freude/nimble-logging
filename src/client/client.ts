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
    source: string;
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

    // This is a special function which should only be called for log messages
    // which have already been formatted, except the {timestamp} format type
    // LoggerClients have a flag which indicates if they should be filling
    // out timestamps.

    // If you wish to use the timestamp relative to the client, then simply
    // set that flag on the LoggerClient
    abstract WriteMessageWithTimestampOnly(message: string): Promise<void>;

    abstract AddSink(sink: ILoggerSink): void;

    // really wish I could provide an immutable view of these sinks
    // for safety purposes..
    GetSinks(): Array<ILoggerSink> {
        return this._settings.sinks;
    }

    protected _settings: ClientSettings;

    constructor(settings: ClientSettings) {
        this._settings = settings;
    }
}

export class Logger extends ILoggerClient {
    async WriteMessageWithTimestampOnly(message: string): Promise<void> {
        // Same as the typical Logger methods, but we expect '{timestamp}' is possibly
        // present still.
    }

    AddSink(sink: ILoggerSink): void {
        this._settings.sinks.push(sink);
    }

    async Debug(message: string): Promise<void> {
        // Build the context, format the log then sink it
        const context = {
            timestamp: new Date(),
            loglevel: LogLevel.Debug,
            message: message,
            source: this._settings.source,
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
            source: this._settings.source,
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
            source: this._settings.source,
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
            source: this._settings.source,
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
            source: this._settings.source,
        } as LogContext;

        const formattedMessage = this._settings.formatter.format(context);

        this._settings.sinks.forEach(sink => {
            return sink.SinkLog(formattedMessage);
        });
    }
}
