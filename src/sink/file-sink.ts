import { ILoggerSink } from "./sink";
import { PathLike, createWriteStream, WriteStream } from "fs";
import { ok } from "assert";

/**
 * A file sink is a simple sink which takes incoming log messages and writes them to a file.
 */

export class FileSink implements ILoggerSink {
    // We have access to just the file-descriptor
    private _writeStream!: WriteStream;
    private _initialized: boolean = false;

    // TODO: Kind of annoying to require people to send in a string with the file-open flags
    // Any better way to encapsulate this in some type..?
    constructor() {}

    // Initializes the FileSink, if things go well the sink becomes valid
    async Initialize(
        filePath: PathLike,
        mode: number,
        flags: string
    ): Promise<boolean> {
        try {
            this._writeStream = createWriteStream(filePath, {
                flags: flags,
                mode: mode,
            });
            this._initialized = true;
            return true;
        } catch (err) {
            throw `Could not initialize file at path ${filePath} with mode: ${mode} and flags: ${flags}. Error: ${err}`;
        }
    }

    async SinkLog(message: string): Promise<void> {
        ok(this._initialized, "FileSink is not initialized");

        this._writeStream.write(message);
    }
}
