---
alwaysApply: true
---
# General Patterns
- If you need to execute a command, you must **ONLY** use commands available through moonrepo (check `moon.yml` files for available commands).
- **NEVER** refactor existing code that was not changed as part of your task **UNLESS** it introduces a break change that requires refactoring in usage.
- If you think some code is redundant, **ALWAYS** ask before removing it.
