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

server.listen(1337);
console.log('Listening on port 1337');

io.on("connection", socket => {
    console.log("Got a connection!");

    socket.on("disconnect", () => {
        console.log("Got a disconnection!");
    });

    socket.on("NimbleLogSink", message => {
        console.log(`Got message: ${message}`);
		// just pong it back
		socket.emit("ServerResponse", message);
    });
});
