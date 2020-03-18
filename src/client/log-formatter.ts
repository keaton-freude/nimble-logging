import { LogLevel, LogLevelToStringMap } from "./log-level";
import { LogContext } from "./log-context";

// ILogFormatter interface represents the ability to consume a
// LogContext and emit a string ready to be sunk
export interface ILogFormatter {
    format(context: LogContext): string;
}

interface InterpolationPair {
    key: string;
    getValue: (context: LogContext) => string;
}

const interpolationMappings: Array<InterpolationPair> = [
    {
        key: "timestamp",
        getValue: (context: LogContext) => {
            if (!context.timestamp) {
                throw Error("Context did not have a timestamp field set!");
            }
            // For now, specify time like: YYYY-MM-DD HH-MM-SS in 24-hour mode
            return context.timestamp
                .toISOString()
                .replace(/T/, " ")
                .replace(/\..+/, "");
        },
    },
    {
        key: "loglevel",
        getValue: (context: LogContext) => {
            if (!context.loglevel) {
                throw Error("Context did not have a timestamp field set!");
            }
            return LogLevelToStringMap[context.loglevel];
        },
    },
    {
        key: "message",
        getValue: (context: LogContext) => {
            if (!context.message) {
                throw Error("Context did not have a timestamp field set!");
            }
            return context.message;
        },
    },
    {
        key: "source",
        getValue: (context: LogContext) => {
            if (!context.source) {
                throw Error("Context did not have a timestamp field set!");
            }
            return context.source;
        },
    },
];

// These can be passed directly into `substring` function
interface SubstringLocation {
    start: number;
    end: number;
}

// The data-structure we keep our `interpolationType` -> `insertionPoint` mapping
interface InterpolationPoint {
    type: string;
    location: SubstringLocation;
}

// Simple error class so we can filter for this specific error
export class FormatStringError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, FormatStringError.prototype);
    }
}

/**
 * An interpolated log formatter has an associated format string
 * Identifiers within the format string are replaced with values
 * in the LogContext
 */
export class InterpolatedLogFormatter {
    private _formatString: string;
    private _applyTimestamp: boolean;
    private _interpolationPoints: Array<InterpolationPoint>;

    constructor(formatString: string, applyTimestamp: boolean) {
        this._formatString = formatString;
        this._applyTimestamp = applyTimestamp;
        this._interpolationPoints = [];

        this.cacheInterpolationPoints();
    }

    private interpolationTypeExists(type: string): boolean {
        return interpolationMappings.some(element => {
            return element.key === type;
        });
    }

    private fixEscapedBrackets(): void {
        // Users can escape brackets with `\{}`
    }

    private cacheInterpolationPoints(): void {
        // Search through format string looking for interpolation points
        // As they are found, replace them using the interpolation map

        // Interpolation points take the form: {<type>}
        // This means that `{` is invalid to be used along, unless it has a
        // matching `}` _and_ the type is valid.
        // NOTE: There is currently _no way_ to escape the Brackets!
        // This can be changed if necessary, but don't want to spend time on the
        // edge cases right now

        // NOTE: There's probably a smoother way to handle this but here we are
        let lastIndex = 0;

        while (true) {
            // Look for a { character
            let currentOpenBracketIndex = this._formatString.indexOf(
                "{",
                lastIndex
            );

            // If we can't find a '{' we are done
            if (currentOpenBracketIndex === -1) {
                break;
            }

            // Find the matching '}'

            let currentClosedBracketIndex = this._formatString.indexOf(
                "}",
                currentOpenBracketIndex
            );
            let nextOpenBracketIndex = this._formatString.indexOf(
                "{",
                currentOpenBracketIndex + 1
            );

            // If we can't find a matching } this is an error
            // Also, if we find a `}` before we find a `{` this is a malformed pair

            if (currentClosedBracketIndex === -1) {
                throw new FormatStringError(
                    `Format string: ${this._formatString} invalid.
                    Did not find a closing bracket for open bracket at index ${currentOpenBracketIndex}
                `
                );
            }

            if (
                nextOpenBracketIndex !== -1 &&
                nextOpenBracketIndex < currentClosedBracketIndex
            ) {
                // We don't support nested interpolation points, this means we found
                // another '{' before finding the closing bracket
                throw new FormatStringError(
                    `Format string: ${this._formatString} invalid.
                    Did not find a matching closing bracket for open bracket at index ${currentOpenBracketIndex}
                    Instead found an open bracket at index ${nextOpenBracketIndex}
                    `
                );
            }

            // If the closing bracket is immediately after the open bracket, this is invalid as
            // no interpolation type was specified
            if (currentOpenBracketIndex === currentClosedBracketIndex + 1) {
                throw new FormatStringError(
                    `Format string: ${this._formatString} invalid.
                    No interpolation type specified between brackets at ${currentOpenBracketIndex} and ${currentClosedBracketIndex}
                    `
                );
            }

            // Next, extract the interpolation type, ensure it exists in our mapping. If so, cache it
            const interpolationType = this._formatString.substring(
                currentOpenBracketIndex + 1,
                currentClosedBracketIndex
            );

            if (!this.interpolationTypeExists(interpolationType)) {
                throw new FormatStringError(
                    `Format string: ${this._formatString} invalid.
                    Interpolation type ${interpolationType} is not valid. Are you missing the registration of the type?
                    The location of this type is: ${currentOpenBracketIndex +
                        1}, ${currentClosedBracketIndex - 1}
                    `
                );
            }

            // If we are not applying timestamps (because we don't trust this devices
            // view of the time), skip the timestamp format-type
            if (!this._applyTimestamp) {
                if (interpolationType === "timestamp") {
                    lastIndex = currentClosedBracketIndex;
                    continue;
                }
            }

            // We're all good, cache this type along with the location it was found
            this._interpolationPoints.push({
                type: interpolationType,
                location: {
                    start: currentOpenBracketIndex,
                    end: currentClosedBracketIndex + 1,
                },
            });

            lastIndex = currentClosedBracketIndex;
        }
    }

    format(context: LogContext): string {
        // Create a copy of the string which we can mutate, we will build it in-place

        // NOTE: This seems to be a reliable way to perform a deep-copy?
        let copiedFormatString = this._formatString.repeat(1);

        // Iterate through the interpolation points, building a new string
        this._interpolationPoints.forEach(point => {
            // Get the function which returns the string to be inserted
            const mapping = interpolationMappings.find(mapping => {
                return mapping.key === point.type;
            });
            if (!mapping) {
                throw Error(
                    `No interpolation mapping found for type ${point.type}`
                );
            }

            // Each point represents some section of the string which should be replaced
            copiedFormatString =
                copiedFormatString.substring(0, point.location.start) +
                mapping.getValue(context) +
                copiedFormatString.substring(point.location.end);
        });

        return copiedFormatString;
    }
}
