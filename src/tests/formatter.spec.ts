import { ILogFormatter, InterpolatedLogFormatter, LogLevel } from "../client";
import { LogContext } from "../client/log-context";
import { expect } from "chai";

describe("Log Formatter", () => {
    const context: LogContext = {
        message: "This is a message",
        loglevel: LogLevel.Info,
        source: "Source",
        timestamp: new Date(2000, 0, 1, 12, 0, 0, 0),
    };

    it("Should support {message} type", () => {
        // Create the log formatter and test context and ensure
        // it formats as expected
        const formatter: ILogFormatter = new InterpolatedLogFormatter(
            "{message}"
        );

        const result = formatter.format(context);

        expect(result).to.equal("This is a message");
    });

    it("Should support {loglevel} type", () => {
        const formatter: ILogFormatter = new InterpolatedLogFormatter(
            "{loglevel}"
        );

        const result = formatter.format(context);

        expect(result).to.equal("Info");
    });

    it("Should support {timestamp} type", () => {
        const formatter: ILogFormatter = new InterpolatedLogFormatter(
            "{timestamp}"
        );

        const result = formatter.format(context);

        // NOTE: This will only work in PST time-zone I think. Fix it..
        expect(result).to.equal("2000-01-01 20:00:00");
    });

    it("Should support {source} type", () => {
        const formatter: ILogFormatter = new InterpolatedLogFormatter(
            "{source}"
        );

        const result = formatter.format(context);

        expect(result).to.equal("Source");
    });
});
