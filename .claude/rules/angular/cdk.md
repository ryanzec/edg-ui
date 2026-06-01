---
alwaysApply: true
---
# IMPORTANT: These rules override general typescript / angular rules
# General Angular CDK Patterns
- **ALWAYS** use Angular CDK whenever it has functionality available, **ONLY** resort to custom logic when Angular CDK does not provide the needed functionality or the functionality is one of the following:
  - For drag and drop functionality, **ALWAYS** use `@atlaskit/pragmatic-drag-and-drop` **INSTEAD** of Angular CDK.
- **ALWAYS** use `cdkObserveContent` over native solutions like `MutationObserver` when possible.
