describe("Console Logging", () => {
    // Hook the console..

    beforeEach(() => {});
    afterEach(() => {
        // reset the console
        console.logs.length = 0;
    });
    it("should work", () => {
        console.stdlog = console.log.bind(console);
        console.logs = [];
        console.log = function() {
            console.logs.push(Array.from(arguments));
            console.stdlog.apply(console, arguments);
        };

        const logger = new nimble.Logger({
            sinks: [new nimble.ConsoleSink()],
            formatter: new nimble.InterpolatedLogFormatter("{message}"),
        });

        logger.Info("Hello, world!");

        expect(console.logs[0][0]).to.equal("Hello, world!");
    });
});
