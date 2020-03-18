describe("Websocket Logging", () => {
    beforeEach(() => {});
    afterEach(() => {});
    it("should send logs over websocket", done => {
        var socket = io("http://localhost:1337");

        // connect the websocket
        const logger = new nimble.Logger({
            sinks: [new nimble.WebsocketSink(socket)],
            formatter: new nimble.InterpolatedLogFormatter("{message}"),
        });

        socket.on("ServerResponse", message => {
            chai.expect(message).to.equal("Some Log");
            done();
        });

        logger.Debug("Some Log");
    });

    it("Should handle logs on both ends", done => {
        // In this test we want to ensure that logs are emitted over a websocket
        // and that the backend can receive logs without directly listening on the
        // websocket. Instead they should use the WebsocketListener

        /**
         * Flow is:
         *  1) Create Logger with Websocket Sink
         *  2) Log a message
         *  3) Wait for echo from server
         *  4) Server emits a message on a special channel, internal to the
         *     WebsocketListener class
         *  5) #4 is achieved by using a test Sink, which takes the socket
         *     and emits on a known channel
         */

        var socket = io("http://localhost:1337");

        const logger = new nimble.Logger({
            sinks: [new nimble.WebsocketSink(socket)],
            formatter: new nimble.InterpolatedLogFormatter("{message}"),
        });

        socket.on("ServerResponse2", message => {
            chai.expect(message).to.equal("Some Log");
            done();
        });

        logger.Debug("Some Log");
    });
});
