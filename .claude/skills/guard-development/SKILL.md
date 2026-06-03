---
name: guard-development
description: Use this skill whenever working on an Angular route guard. Enforces single-concern scope, correct return types (`Observable`/`Promise`/`boolean`/`UrlTree`), efficient async, performance, and no side effects.
---
# Guard Development Skill

# Rules
- Must **ONLY** focus on checking one logic group of things (if you need to validate the user is authenticated and has a certain permission, that would be 2 guards instead of one).
- **ALWAYS** make sure it is returning proper types (`Observable`, `Promise`, `boolean`, `UrlTree`).
- **ALWAYS** make sure async logic is handled correctly and efficiently.
- **ALWAYS** make sure the code is highly performant.
- **NEVER** have side effect unless **100%** NECESSARY

# **REQUIRED** End Review

The following must be reviewed after finishing the task before the task can be considered complete:

- Review for any glaring issues.
