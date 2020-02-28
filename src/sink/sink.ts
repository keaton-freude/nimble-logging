import { LogLevel } from "./log-level";

/**
 * A Sink accepts logger messages and does something with them.
 * For example, a WebSocketSink would send the log message out over the network
 * while a FileSink would serialize the log message to a file
 *
 * We can chain Sinks together to do multiple things, for example we might set it up such
 * that all log messages which hit this sink are replicated over the network, while also
 * saving the message to a log file
 *
 * That setup would be like:
 *
 * fileSink: FileSink = new FileSink('/var/tmp/mylog.txt');
 * networkSink: WebSocketSink = new WebSocketSink('namespace');
 * client: ILoggerClient = new LoggerClient([fileSink, networkSink]);
 *
 * Sinks are required to implement their methods as async, so we can process multiple
 * sinks concurrently.
 */

export interface ILoggerSink {
    SinkLog(message: string, level: LogLevel): Promise<void>;
}
