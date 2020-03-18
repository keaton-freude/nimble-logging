import {
    ILogFormatter,
    InterpolatedLogFormatter,
    LogLevel,
    FormatStringError,
} from "../client";
import { LogContext } from "../client/log-context";
import { expect } from "chai";

describe("Log Formatter", () => {
    const context: LogContext = {
        message: "This is a message",
        loglevel: LogLevel.Info,
        source: "Source",
        timestamp: new Date('Jan 01 2000 12:00:00 PST'),
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
        expect(result).to.equal(new Date('Jan 01 2000 12:00:00 PST').toISOString()
                .replace(/T/, " ")
                .replace(/\..+/, ""));
    });

    it("Should support {source} type", () => {
        const formatter: ILogFormatter = new InterpolatedLogFormatter(
            "{source}"
        );

        const result = formatter.format(context);

        expect(result).to.equal("Source");
    });

    it("Should reject nested pairs", () => {
        // We do not support '{{type1}type2}' or any kind
        // of variant. Keeps the parsing simpler and doesn't seem
        // very useful. Create a malformed format string and ensure
        // it throws the correct error
        try {
            const formatter: ILogFormatter = new InterpolatedLogFormatter(
                "{source{message}}"
            );

            expect(true).to.equal(false);
        } catch (err) {
            if (err instanceof FormatStringError) {
                expect(true).to.equal(true);
            } else {
                expect(true).to.equal(false);
            }
        }
    });

    it("Should reject unbalanced pairs", () => {
        try {
            const formatter: ILogFormatter = new InterpolatedLogFormatter(
                "{source"
            );
            expect(true).to.equal(false);
        } catch (err) {
            if (err instanceof FormatStringError) {
                expect(true).to.equal(true);
            } else {
                expect(true).to.equal(false);
            }
        }
    });
});
