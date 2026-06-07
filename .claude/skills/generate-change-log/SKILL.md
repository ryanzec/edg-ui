---
name: generate-change-log
description: Use this skill to generate a concise changelog for un-committed changes in the current branch.
disable-model-invocation: true
---
# Generate Change Log Skill

You are tasked to review all the unstaged and staged changes in the repository and respond with a concise list of what changed.

## Things To Omit

The following must **NEVER** be included in the change logs
- Changes related to specific tests (systemic changes to how test work or utilities related to testing code **MUST** be included).
- Changes related to storybook specific code.

# Output Structure

The output response structure must be **CONCISE** and follow this format (note for you are prefixed with `#` and must **NOT** be included in the output generated):

```
DX / Tooling / Package Updates
- **{{tool | package | DX}}**:  {{The change}}

Framework Updates
# repeat this list item for each framework update
- **{{feature name}}**: {{The change}}

Example / Template Updates
# repeat this list item for each framework update
- **{{feature name}}**: {{The change}}

Application Updated
# repeat this list item for each application update
- **{{feature name}}**: {{The  change}}

Misc Cleanup
- **{{feature name}}**: {{The change}}
```

Each group is catagorized with the following rules

## DX / Tooling / Package Update
- adding, removing, or updating the version of a npm package.
- adding, removing, or updating a moonrepo task or any moonrepo related configurations.
- adding, removing, or updating ai context files in `.claude` **ONLY** (**IGNORE** all other ai related context files).

## Framework Update
- This includes any changes to code in `projects/shared-ui/src/lib/core` or `projects/shared-ui/src/lib/layout` that has a functional / or stylistic change (something that adds functionality, removed functionality, changes how something existing works, changes how the component is rendered).

## Example / Template Update
- This includes any changes to code in `projects/shared-ui/src/lib/examples` or `projects/shared-ui/src/lib/templates` that has a functional change (something that adds functionality, removed functionality, changes how something existing works).

## Application Update
- This includes any changes to code that is **NOT** included in the Framework of Example / Template update rules.

## Misc Cleanup
- Any change that does not change the functionality (like a refactor that works different but has the same output).

## General Rules
- The changelog must properly use markdown's bold syntax and inline code syntac when applicable.
- This `{{tool | package | DX}}` and `{{feature name}}` Must be wrapped in markdown bold syntax `**...**`.
- All code referenced must be wrapping in single backticks '``'.
- The output must be the **RAW** markdown.
