You are tasked to review the reference component along with their design tokens that may or my not exist in the `projects/shared-ui/src/lib/styles/tokens` directory and make sure the component to utilitizing the `.claude/rules/use-cases/css-local-variables.md` use case properly.

You are to verify:
- If there is a css variable, the css code should only set the css properties **ONCE** for that css variables.
- If the component has different variants for a css variable, then the css code **MUST** override the css variable value and **NEVER** apply the css property again.

# Bad Code Example
Design token file:
```css
/* size: xs */
--tag-padding-inline-xs: var(--spacing-1_5); /* 6px */
--tag-font-size-xs: var(--font-size-2xs); /* 10px */
--tag-gap-xs: var(--spacing-1); /* 4px */

/* size: sm */
--tag-padding-inline-sm: var(--spacing-2); /* 8px */
--tag-font-size-sm: var(--font-size-2xs); /* 10px */
--tag-gap-sm: var(--spacing-1); /* 4px */

/* size: base */
--tag-padding-inline-base: var(--spacing-2_5); /* 10px */
--tag-font-size-base: var(--font-size-xs); /* 12px */
--tag-gap-base: var(--spacing-1_5); /* 6px */
```

Component css file:
```css
/* sizes */
  :host([data-size='xs']) {
    padding-inline: var(--tag-padding-inline-xs);
    font-size: var(--tag-font-size-xs);
    gap: var(--tag-gap-xs);
  }

  :host([data-size='sm']) {
    padding-inline: var(--tag-padding-inline-sm);
    font-size: var(--tag-font-size-sm);
    gap: var(--tag-gap-sm);
  }

  :host([data-size='base']) {
    padding-inline: var(--tag-padding-inline-base);
    font-size: var(--tag-font-size-base);
    gap: var(--tag-gap-base);
  }
```

# Good conversion of the bad code example
```css
--tag-padding-inline: var(--spacing-2_5); /* 10px */
--tag-font-size: var(--font-size-xs); /* 12px */
--tag-gap: var(--spacing-1_5); /* 6px */
```

```css
/* sizes */
  :host {
    padding-inline: var(--tag-padding-inline);
    font-size: var(--tag-font-size);
    gap: var(--tag-gap);
  }

  :host([data-size='xs']) {
    --tag-padding-inline-xs: var(--spacing-1_5); /* 6px */
    --tag-font-size-xs: var(--font-size-2xs); /* 10px */
    --tag-gap-xs: var(--spacing-1); /* 4px */
  }

  :host([data-size='sm']) {
    --tag-padding-inline-sm: var(--spacing-2); /* 8px */
    --tag-font-size-sm: var(--font-size-2xs); /* 10px */
    --tag-gap-sm: var(--spacing-1); /* 4px */
  }

  :host([data-size='base']) {
    --tag-padding-inline-base: var(--spacing-2_5); /* 10px */
    --tag-font-size-base: var(--font-size-xs); /* 12px */
    --tag-gap-base: var(--spacing-1_5); /* 6px */
  }
```
