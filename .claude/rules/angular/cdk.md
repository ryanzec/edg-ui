---
alwaysApply: true
---
# IMPORTANT: These rules override general typescript / angular rules
# General Angular CDK Patterns
- **ALWAYS** use Angular CDK whenever it has functionality available, **ONLY** resort to custom logic when Angualr CDK does not provide the needed functionality.
- **ALWAYS** use `cdkObserveContent` over native solutions like `MutationObserver` when possible.
