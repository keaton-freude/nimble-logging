# Nimble Logging

A simple logging framework for connecting various logger clients to backend sinks, either directly or through other pipes (like network-syncing)

My usecase is this that I have many different apps running, in my case its:

1. An Angular app which typically logs to the browser console
2. A Typescript backend which logs to the console/syslog
3. `N` devices, running a Typescript app also logging to the console/syslog

A given setup might have up to 8 log producers, manually combining all of these logs is an awful task, especially with synchronization issues

This logging library provides an interface for each of these apps to log, such that a master device (#2 in the above list) will receive all logs and have the ability to serialize the logs to disk. There will be extension points which allow us to categorize our logs, apply levels and finally extension points for the final synchronization target to customize how logs are put together.

Ultimately I want a log file which looks (roughly) like this:

```
[Browser][INFO]@<TSTAMP>: User clicked the send button!
[Browser][DEBUG]@<TSTAMP>: HTTP POST with args <...> sent to <URL>
[Backend][INFO]@<TSTAMP>: Received HTTP POST with args <...> on route /submit
[Backend][INFO]@<TSTAMP>: Notifying all slave devices with new data...
[Backend][DEBUG]@<TSTAMP>: Sending HTTP POST with args <...> sent to <OTHER_URL>
[ClientDevice1][INFO]@<TSTAMP>: Received HTTP POST with args <...>
[ClientDevice1][INFO]@<TSTAMP>: Success!
[Backend][INFO]@<TSTAMP>: Successfuly set settings for <ClientDevice1>, notifying frontend
[Browser][INFO]@<TSTAMP>: Successfuly updated remote devices!
```

The key aspects above are:

1. Synchronized. The events in the log should reflect the real-world in which things happen.
2. Supports Browser->Backend logging. This means logs in the browser console aren't lost to the world.
3. Log levels
4. Source information (where did this log come from?)
5. Time stamps (relative to the backend device, unless we can trust devices to be time-synced)

NOTE: Currently the above does _not_ assume that Timestamps are the _real_ time they happened. But rather the time, relative to the system, things happened. We use a "first-come-first-serve" model in organizing the logs, which may mean there will be some jitter in the ordering. If this becomes an issue, it will be addressed.

## Design

The design revolves around the concept of a log-producer (client) and a sink. Clients are created and configured with one or more sinks. Sinks will receive the log messages, along with call-site customization (log-levels for instance) and decide how to "sink" that message.

The most basic kind of sink would be a `FileSink` which takes the log message and writes it out to a file.

Sinks can do _anything_ they wish with the log message, including forwarding logs to additional sinks or endpoints.

For instance, to achieve "browser->backend" logging, our setup will look like:

`LoggerClient.Info("Message") -> NetworkSink(<configured with some endpoint or socket>) ~~~ NETWORK TRANSPORT ~~~ NetworkSinkListener -> FileSink(<configured with some filename/rules>)`

A `NetworkListener` is just another Sink! These are configured to receive log messages over some network endpoint and can be configured to match the corresponding NetworkSink.

This can also be setup to automatically save log messages to a database based on some ruleset that a Sink might implement.

All that is required is to implement the Sink interface, register it with your client and you're off.

For sinks across a medium (like the network), they will need to be configured to listen for specific messages over something like a web-socket or an HTTP endpoint.

TODO: Ensure we can verify that all data sent over a medium, like a network, is type-checked.

### Design Notes (Personal Notes)

The high level class flow (based on interfaces) should be:
`ILoggerClient` -> `ILogFormatter` -> 1 or more `ILoggerSink`

Implications here are that `ILoggerSink` is _only_ for sinking logs, it does not have any indication of the level of the log.
This means that any kind of filtering based on logging should either happen in the `ILoggerClient` settings, or in post-processing (which is what I intend to do for myself as the logs will be created by third parties).

`ILogFormatter` is an interface which takes in _all_ known information about the log (currently the log message & the log level) and produces a string which can be sunk.

## Testing

You can either run the tests in a `one-shot` mode, or in a `watch` mode.

-   One Shot: Run: `npm run test`
-   Watch: Run: `npm run test:watch`

In `watch` mode, any changes to typescript files will trigger a rerun of the tests. Great for TDD.

## Debug

You can run the tests in debug mode with:

-   One Shot: Run: `npm run test-debug`
-   Watch: Run: `npm run test-debug:watch`

The debugger will automatically attach in `one-shot` mode and `watch` mode.

Watch mode allows you to re-launch and re-attach the debugger whenever file changes are made.
