---
alwaysApply: true
---
# IMPORTANT: These rules override general typescript / angular rules
# General Angular Pipe Patterns
- **ALWAYS** make sure pipes are flagged as `pure: true`.
- **ALWAYS** make sure the pipe only does ONE thing and the name of the pipe CLEARLY indicates what is does.
- **ALWAYS** Make sure the code is highly performant.
- **ALWAYS** make sure the pipe gracefully handles `null` or `undefined` inputs without throwing errors.
- **NEVER** have side effect unless **100%** NECESSARY.
- **ALWAYS** use a single option signature for pipe parameters: `{{ date | orgDate: { dateFormat, timeFormat, showTimezone } }}`
- **ALWAYS** have a export default value for each input of the pipe using the pattern of `{DIRECTORY_NAME}_{INPUT_NAME}_DEFAULT`.
