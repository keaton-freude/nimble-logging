import * as socketio from "socket.io";
import { NetworkSinkEventName } from "./websocket-sink";
import { ILoggerClient } from "../client";

/**
 * A special class (which may not even belong in this library).
 * This is the other end of the `WebsocketSink`, it listens for
 * socket.io events on our registered event name and forwards along
 * to a given sink
 *
 * Expected use case looks like:
 * 1) Browser-side code has created a Logger with a WebsocketSink in its chain
 * 2) Those messages are emitted over the given Websocket
 * 3) The other end of that websocket connection (backend in this case) has
 *    an instance of this class running.
 * 4) It receives messages over the websocket across an expected channel
 * 5) It forwards these messages to a provided Sink
 */

// TODO: Maybe an interface makes sense here for customization
export class WebsocketLogListener {
    private _socket: SocketIO.Socket;
    private _logger: ILoggerClient;
    // @socket: The socket to listen on
    // @logger: The logger, whos sinks we will hit for every received message
    constructor(socket: SocketIO.Socket, logger: ILoggerClient) {
        this._socket = socket;
        this._logger = logger;
        this._socket.on(NetworkSinkEventName, (message: string) => {
            console.log(`Received network log message of: ${message}`);
            this._logger.GetSinks().forEach(sink => {
                sink.SinkLog(message);
            });
        });
    }
}
