---
name: production-review
description: Use this skill when doing a production review of code. Verifies code follows all rules and reports only violations, producing a grouped fix-plan file in `ai-plans` when violations exist.
---
# Production Review Skill

You are tasked to verify the referenced code (and all related code) is following all rules as needed.

# Review Report

You must **ALWAYS** give a report at the end that does the following:
- If there are voliations, report **ONLY** the voliations and follow the `Planned Fixes File` section in this file.
- If there are no voliation, **NEVER** list everything that is good, **ONLY** report there are no voliations and end there.

# Planned Fixes File

If there are voliations, you are tasked to created a plan file in `ai-plans` that includes the following:
- Group related fixes together in each section.
- Each section **MUST** list the rules that are voliated and a plan to fix them.
- If there are any questions and how to fix certain issues, those should be list with a recommended approach.

At the end, **ALWAYS** present the plan files based on the following rules:
- If you can detect the editor that is being used to run you, open in that editor.
- If you can not detect the editor running you, attempt to detect the what editors are available via the command line and ask which editor to open it in.
- If all the above fail, just respond with the full file path to the created plan.
