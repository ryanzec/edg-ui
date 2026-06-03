---
name: pipe-development
description: Use this skill whenever working on an Angular pipe. Covers pure, single-purpose pipes, null/undefined safety, performance, a single options-object parameter signature, and default-value exports.
---
# Pipe Service Development

# Rules
- Must **ONLY** focus on one logic group of functionality.
- **ALWAYS** make sure pipes are flagged as `pure: true`.
- **ALWAYS** make sure the pipe only does ONE thing and the name of the pipe CLEARLY indicates what is does.
- **ALWAYS** Make sure the code is highly performant.
- **ALWAYS** make sure the pipe gracefully handles `null` or `undefined` inputs without throwing errors.
- **NEVER** have side effect unless **100%** NECESSARY.
- **ALWAYS** use a single option signature for pipe parameters: `{{ date | orgDate: { dateFormat, timeFormat, showTimezone } }}`
- **ALWAYS** have a export default value for each input of the pipe using the pattern of `{DIRECTORY_NAME}_{INPUT_NAME}_DEFAULT`.

# **REQUIRED** End Review

The following must be reviewed after finishing the task before the task can be considered complete:

- Review for any glaring issues.
