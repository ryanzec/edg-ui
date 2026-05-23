---
alwaysApply: true
---
# Angular Component Hide Empty Slot Projection

If a component has an element that only wraps a `ng-content select` content projection but that project is not given, it can sometimes cause styling issue, to resolve this issue, we should **ALWAYS** hide said container with css.

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
