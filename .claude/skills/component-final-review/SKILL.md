---
name: component-final-review
description: Use this skill whenever being asked to review an Angular component.
---

# Review Question To Valid
- Is there any code for this component in `projects/shared-ui/src/lib/core` and if so, should any of that code be broken out into a brain directive colocated alongside it in the same `projects/shared-ui/src/lib/core/<component-name>/` directory (file named `<component-name>-brain.ts`)?
- If there is logic in a component that is being used to handle a missing feature in a child component that is being used, **ALWAYS** ask if that should be done or if the child component needs a refactor so the use case can be manually checked
- `::ng-deep` should **NEVER** be used.
- Any questionable logic should be pointed out to be verified it is intended.
