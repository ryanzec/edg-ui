---
alwaysApply: true
---
# Custom Utilities Pattern

When a library in `.claude/rules/libraries.md` does not provided the need functionality, you must **ALWAYS** place common re-usable functionality into util methods in `projects/shared-utils/src/utils`, if a method already exists use it, otherwise add it (or add a new file in needed in `projects/shared-utils/src/utils`).

Utility files must **ONLY** export the types and a single object of `{file_name}-Utils` like:
```ts
import { DateTime, Settings } from 'luxon';

export const TimezoneFormat = {
  STANDARD: 'ZZZZ',
} as const;

export type TimezoneFormat = (typeof TimezoneFormat)[keyof typeof TimezoneFormat];

// ...

/**
 * Returns a human-readable relative time string (e.g., "5 minutes ago", "in 3 days") for the given date time.
 * When the difference is within one minute, returns `moments ago` (past) or `in moments` (future).
 * Returns `----` if the date time is invalid or a relative string cannot be generated.
 */
const fromNow = (dateTime: DateTime): string => {
  // ...
};

export const dateUtils = {
  fromNow,
};
```

It must **NEVER** export the method individually.
