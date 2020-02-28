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
