import { ILoggerSink } from "./sink";
import { LogLevel } from "./log-level";

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

    protected _sinks: Array<ILoggerSink>;

    constructor(sinks: Array<ILoggerSink>) {
        this._sinks = sinks;
    }
}

export class Logger extends ILoggerClient {
    AddSink(sink: ILoggerSink): void {
        throw new Error("Method not implemented.");
    }
    async Debug(message: string): Promise<void> {
        this._sinks.forEach(sink => {
            return sink.SinkLog(message, LogLevel.Debug);
        });
    }
    async Warning(message: string): Promise<void> {
        this._sinks.forEach(sink => {
            return sink.SinkLog(message, LogLevel.Warning);
        });
    }
    async Error(message: string): Promise<void> {
        this._sinks.forEach(sink => {
            return sink.SinkLog(message, LogLevel.Error);
        });
    }
    async Fatal(message: string): Promise<void> {
        this._sinks.forEach(sink => {
            return sink.SinkLog(message, LogLevel.Fatal);
        });
    }
    async Info(message: string): Promise<void> {
        this._sinks.forEach(sink => {
            return sink.SinkLog(message, LogLevel.Info);
        });
    }
}
