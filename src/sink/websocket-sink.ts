import { ILoggerSink } from "./sink";
import * as socketio from "socket.io-client";

/**
 * A WebsocketSink takes its message and broadcasts it over
 * a websocket.
 *
 * For now we just support socket.io, this should be updated
 * at some point to support a generic socket interface so we
 * can implement a variety of websocket libraries if necessary
 */

export const NetworkSinkEventName = "NimbleLogSink";

/**
 * TODO: We need _way_ more validation and information added
 * to this class. Right now its very happy-go-lucky
 */
export class WebsocketSink implements ILoggerSink {
    private _socket: SocketIOClient.Socket;

    // User gives us a socket that we will sink logs to
    constructor(socket: SocketIOClient.Socket) {
        this._socket = socket;
    }
    async SinkLog(message: string): Promise<void> {
        // Possibly expand the interface of the message we send
        this._socket.emit(NetworkSinkEventName, message);
    }
}
