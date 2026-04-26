---
alwaysApply: true
---
# IMPORTANT: These rules override general typescript / angular / angular components rules
# General Angular View Component Patterns
- **ALWAYS** utilize available components in `projects/shared-ui` project instead of creating bespken components for the view.
- **ALWAYS** make sure to add the route for a new view component if a route is not already configured.
- **ALWAYS** ask if you need to make a new component if the new component should be created in the `shared-ui` project.
- **ALWAYS** ask if a customization is needed to a component in `shared-ui` if that change should be made in the `shared-ui` component instead of one off in the view component.
