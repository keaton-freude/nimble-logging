import * as socketio from "socket.io";
import { NetworkSinkEventName } from "./websocket-sink";

/**
 * A special class (which may not even belong in this library).
 * This is the other end of the `NetworkSink`, it listens for
 * socket.io events on our registered event name and forwards along
 * to a given sink
 */

// TODO: Maybe an interface makes sense here for customization
export class WebsocketLogListener {
    private _socket: SocketIO.Socket;
    constructor(socket: SocketIO.Socket) {
        this._socket = socket;
        this._socket.on(NetworkSinkEventName, (message: string) => {
            console.log(`Received network log message of: ${message}`);
            // TODO: Forward to a sink here
        });
    }
}
