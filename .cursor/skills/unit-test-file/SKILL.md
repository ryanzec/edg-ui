---
name: unit-test-file
description: Use this skill whenever being asked to unit test a particular file.
---
# Unit Test File

When being asked to unit test a single file you want to use this command:
```bash
moon run shared-ui:test-unit -- --include="{{PATH TO FILE}}}}" --watch=false 2>&1 | tail -80
```
This is the **ONLY** thing you should do any nothing else you get the result and then present your findings to me.

If the test passed, that is all that needs to be reported.

If the tests fail, you **MUST** do the following:
- Present which tests fails and why.
- A plan to fix the test.
- If you think the production code needs to be modified and not the test, call that out with a ⚠️ (Warning Sign).
