/**
 * This is a test server which will be spun up for the karma
 * browser tests.
 *
 * It will provide consistent responses to pre-determined actions
 *
 */
var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var nimble = require("../../../dist/index.js");

class TestNetworkSink {
    constructor(socket) {
        this._socket = socket;
    }

    SinkLog(message) {
        this._socket.emit("ServerResponse2", message);
    }
}

app.get("/", (req, res) => res.send("Hello, world!"));

server.listen(1337);
console.log("Listening on port 1337");

io.on("connection", socket => {
    console.log("Got a connection!");

    // Create our dummy logger
    var logger = new nimble.Logger({
        formatter: null,
        sinks: [new TestNetworkSink(socket)],
    });

    // Create the frontend->backend listener
    var listener = new nimble.WebsocketLogListener(socket, logger);

    socket.on("disconnect", () => {
        console.log("Got a disconnection!");
    });

    socket.on("NimbleLogSink", message => {
        console.log(`Got message: ${message}`);
        // just pong it back
        socket.emit("ServerResponse", message);
    });
});
