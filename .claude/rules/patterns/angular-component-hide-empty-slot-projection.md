---
alwaysApply: true
---
# Angular Component Hide Empty Slot Projection Pattern

When a component has an element that only wraps a `ng-content select` content projection, a missing projection can cause styling issues.

- **ALWAYS** hide that container with CSS when the projected content is not given.

# Reference
```html
<div class="header-actions">
  <ng-content select="[actions]" />
</div>
```
```css
.header-actions:not(:has(*)) {
  display: none;
}
```
