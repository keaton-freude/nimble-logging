import { ILoggerSink } from "./sink";

// Writes out to the console, like a typical `console.log`
export class ConsoleSink implements ILoggerSink {
    async SinkLog(message: string): Promise<void> {
        console.log(message);
    }
}
