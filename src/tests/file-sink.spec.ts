import { SinkFactory } from "../sink/sink-factory";
import { expect } from "chai";
import { unlink, readFile } from "fs";
import { promisify } from "util";
import { LogLevel } from "../client/log-level";

const unlinkAsync = promisify(unlink);
const readFileAsync = promisify(readFile);

/**
 * Going to actually write files out in these tests, so might as well be called integration tests
 */

const testFilePath: string = "./.test-file-sink";

describe("File Sink", async () => {
    it("Should create a file sink with factory", async () => {
        try {
            const fileSink = await SinkFactory.CreateFileSink(
                testFilePath,
                0o666, // unix permissions: read & write
                "a"
            );
        } catch (err) {
            // something went wrong
            throw Error(`Failed to create file sink. Error: ${err}`);
        }
    });

    it("Should sink log messages to file", async () => {
        try {
            const fileSink = await SinkFactory.CreateFileSink(
                testFilePath,
                0o666,
                "a"
            );

            await fileSink.SinkLog("SomeMessage", LogLevel.Info);

            // Verify the message was sunk to a file
            const contents = (await readFileAsync(testFilePath)).toString();

            expect(contents).to.equal("SomeMessage");
        } catch (err) {
            throw Error(`Failed something. Error: ${err}`);
        }
    });

    afterEach(async () => {
        // Cleanup after ourselves
        await unlinkAsync(testFilePath);
    });
});
