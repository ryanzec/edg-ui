---
alwaysApply: true
---
# Angular Content Projection Pattern

When a component needs to project content, there are two ways to do this, each with a defined context for when to use which.

## NG Content Select (Default)

The default, simpler implementation uses the named slot pattern with `<ng-content select="">`:
```html
<!-- component template --> 
<ng select="header" />

<!-- projecting when using the component -->
<org-custom-component>
  <h1 header>Header</h1>
</org-custom-component>
```

## Template Outlet (Power Usage)

The power-usage implementation uses `<ng-container>` + `<ng-template>` with `ngTemplateOutlet`:
```ts
// in the component class
protected headerTemplate = contentChild<TemplateRef<unknown>>('header');
```

```html
<!-- component template --> 
@if (headerTemplate(); headerTemplate) {
  <ng-container [ngTemplateOutlet]="headerTemplate">
}

<!-- projecting when using the component -->
<org-custom-component>
    <ng-template #pre><h1>Custom PreContent</h1></ng-template>
</org-custom-component>
```

You must **ALWAYS** use the Template Outlet pattern if any of the following are true:
- The template needs to be applied multiple times in a loop.
- Internal data of the component needs to be passed to the template.
- The presence of the template is conditional in **ANY** way.
- You need to lazy load the content.
