---
name: api-service-development
description: Use this skill whenever working on an API service (a `*-api.ts` file or a service primarily making HTTP requests). Covers PATCH-over-PUT updates, `providedIn: 'root'`, and skipping stories.
---
# Api Service Development Skill

# Rules
- **ALWAYS** use `patch` for http update requests
- **NEVER** use `put` for http update requests
- **ALWAYS** use the `providedIn: 'root'` option
- **NEVER** create stories for these types of services
- **ALWAYS** convert DateTime fields to strings before sending them to the API.

# **REQUIRED** End Review

The following must be reviewed after finishing the task before the task can be considered complete:

- Review for any glaring issues.
