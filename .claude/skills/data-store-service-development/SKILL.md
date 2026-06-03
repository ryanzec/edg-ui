---
name: data-store-service-development
description: Use this skill whenever working on a data store service (a `*-data-store.ts` file or an implementation of the base data store classes in `projects/shared-ui/src/lib/core/data-store`). Enforces single-data-concern scope, returning API results as Observables, and skipping stories.
---
# Data Store Service Development Skill

# Rules
- A data store must **ONLY** focus one one piece of data (while the `RuleDataStore` can have a method to load findings for the rule that is currently active, it should be not able to load all findings).
- **ALWAYS** return the result of api requests from data store method that make api requests as `Observerable<...>`.
- **NEVER** create stories for these types of services.

# **REQUIRED** End Review

The following must be reviewed after finishing the task before the task can be considered complete:

- Review for any glaring issues.
