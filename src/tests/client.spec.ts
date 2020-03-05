import { expect } from "chai";
import { ILoggerSink } from "../sink/sink";

import "mocha";
import { LogLevel } from "../client/log-level";
import { ILoggerClient, Logger } from "../client";
import { BasicLogFormatter } from "../client/log-formatter";

/**
 * Create our own Sink, so we can intercept the logs and verify them
 */

let lastMessage: string = "";
let lastMessage2: string = "";

class TestLogSink implements ILoggerSink {
    async SinkLog(message: string): Promise<void> {
        lastMessage = message;
    }
}

class TestLogSink2 implements ILoggerSink {
    async SinkLog(message: string): Promise<void> {
        lastMessage2 = message;
    }
}

describe("Logger Client", () => {
    let logger: ILoggerClient;
    beforeEach(() => {
        // Create the logger instance, reseting any lingering state
        logger = new Logger({
            sinks: [new TestLogSink()],
            formatter: new BasicLogFormatter(),
        });
        lastMessage = "";
    });

    it("Should Support Debug Level", async () => {
        await logger.Debug("TestMessageDebug");
        expect(lastMessage).to.equal("TestMessageDebug");
    });

    it("Should Support Info Level", async () => {
        await logger.Info("TestMessageInfo");
        expect(lastMessage).to.equal("TestMessageInfo");
    });

    it("Should Support Warning Level", async () => {
        await logger.Warning("TestMessageWarning");
        expect(lastMessage).to.equal("TestMessageWarning");
    });

    it("Should Support Error Level", async () => {
        await logger.Error("TestMessageError");
        expect(lastMessage).to.equal("TestMessageError");
    });

    it("Should Support Fatal Level", async () => {
        await logger.Fatal("TestMessageFatal");
        expect(lastMessage).to.equal("TestMessageFatal");
    });

    it("Should have unique values for log levels", async () => {
        // Assert every log level is unique. Duplicates break our
        // contract
        const map: Array<number> = [];
        const values = Object.values(LogLevel);

        for (const level of values) {
            const val = Number(level);
            if (!isNaN(val)) {
                // Its a number
                if (map[Number(level)] !== undefined) {
                    // been here already
                    throw Error(
                        `Duplicate Log Level value: ${Number(level)} found.`
                    );
                }
                map[Number(level)]++;
            }
        }
    });

    it("Should add additional sinks", async () => {
        // Create a Logger with no sinks, add our test sink, ensure we are receiving messages
        // Then add another custom sink, ensure we are receiving messages on both
        let _logger = new Logger({
            sinks: [],
            formatter: new BasicLogFormatter(),
        });

        _logger.AddSink(new TestLogSink());

        _logger.Info("Info Message");

        expect(lastMessage).to.equal("Info Message");

        _logger.AddSink(new TestLogSink2());

        _logger.Info("Info Message 2");

        expect(lastMessage).to.equal("Info Message 2");
        expect(lastMessage2).to.equal("Info Message 2");
    });
});
