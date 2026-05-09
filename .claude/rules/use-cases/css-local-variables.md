---
alwaysApply: true
---
## CSS Local Variables

When a component need multiple variants of something (like size, color, etc.) we should be setting the css property **ONCE** using a component design token (css variable) and then to avoid it, we need to override the **DESIGN TOKEN** and **NEVER** override the css property. This reduces the amount of code needs which in general should make the code easier to reason about.
