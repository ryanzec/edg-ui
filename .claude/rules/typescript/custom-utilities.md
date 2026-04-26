---
alwaysApply: true
---
# Custom Utilities
When a library in `.claude/rules/libraries.md` does not provided the need functionality, you must **ALWAYS** place common re-usable functionality into util methods in `projects/shared-utils/src/utils`, if a method already exists use it other add it (or add a new file in needed in `projects/shared-utils/src/utils`).

When creating a new utils file, always reference the exist ones for the general pattern of implementation.
