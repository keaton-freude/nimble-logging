import { FileSink } from "./file-sink";
import { ILoggerSink } from "./sink";
import { PathLike } from "fs";

// This lets us expose a single way of creating sinks, asynchronously

export class SinkFactory {
    static async CreateFileSink(
        path: PathLike,
        mode: number,
        flags: string
    ): Promise<ILoggerSink> {
        const fileSink = new FileSink();
        await fileSink.Initialize(path, mode, flags);
        return fileSink;
    }
}
