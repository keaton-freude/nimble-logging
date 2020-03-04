describe("Websocket Logging", () => {
    beforeEach(() => {});
    afterEach(() => {});
    it("should work", done => {
        var socket = io("http://localhost:1337");

        // connect the websocket
        const logger = new nimble.Logger({
            sinks: [new nimble.WebsocketSink(socket)],
            formatter: new nimble.BasicLogFormatter(),
        });

        socket.on("ServerResponse", message => {
            chai.expect(message).to.equal("Some Log");
            done();
        });

        logger.Debug("Some Log");
    });
});
