---
alwaysApply: true
---
# Needing Multiple `<ng-content />` Elements Pattern

Angular templates can only have one `<ng-content />`, so when multiple locations need to project the same content, use the built-in `NgTemplateOutlet` feature.

- Put the `<ng-content />` inside a `<ng-template />`.
- Reference that template with `<ng-container />` in each location it is needed.
- See `projects/shared-ui/src/lib/core/list` list item for a **PATTERN** reference of this use case.
