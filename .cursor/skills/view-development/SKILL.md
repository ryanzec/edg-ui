---
name: view-development
description: Use this skill when developing view components in `projects/customer-portal` or `projects/internal-portal`. These wire up route-level providers with minimal logic, reusing `shared-ui` components and registering routes.
---
# View Component Developement Skill

These component are mainly responsible for adding services to the `provides` that are needed for the component they are using.

# Rules
- **ALWAYS** utilize available components in `projects/shared-ui` project instead of creating bespken components for the view.
- **ALWAYS** make sure to add the route for a new view component if a route is not already configured.
- **ALWAYS** ask if you need to make a new component if the new component should be created in the `shared-ui` project.
- **ALWAYS** ask if a customization is needed to a component in `shared-ui` if that change should be made in the `shared-ui` component instead of one off in the view component.
- These components should have minimum functionality and and rely mainly on the functionality from the code in `projects/shared-ui`.
