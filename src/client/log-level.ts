export enum LogLevel {
    Debug = 1,
    Warning = 2,
    Error = 4,
    Fatal = 8,
    Info = 16,
}

export const LogLevelToStringMap: Record<LogLevel, string> = {
    [LogLevel.Debug]: "Debug",
    [LogLevel.Warning]: "Warning",
    [LogLevel.Error]: "Error",
    [LogLevel.Fatal]: "Fatal",
    [LogLevel.Info]: "Info",
};
