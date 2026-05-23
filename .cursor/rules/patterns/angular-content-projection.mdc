---
alwaysApply: true
---
# Angular Content Projection

When a component need to project content in the the component when using it are are two main ways to do this with defined contexts of when you use which.

## NG Content Select (Default)

The default pattern which is a simpler implementation is to use the named slot pattern with`<ng-content select="">`:
```html
<!-- component template --> 
<ng select="header" />

<!-- projecting when using the component -->
<org-custom-component>
  <h1 header>Header</h1>
</org-custom-component>
```

## Template Outlet (Power Usage)

This patterns is to use the `<ng-container>` + `<ng-template>` and `ngTemplateOutlet` which is:
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

If any of the following things are true, you must **ALWAYS** use the Template Outlet pattern:
- The template needs to be applied multiple times in a loop.
- Internal data of the component needs to be passed to the template.
- If the presentence of the template is conditional used to in **ANY** way.
- You need to lazy load the content.
