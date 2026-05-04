<!-- 
Inputs:
- specific directory for code to review
-->
You are tasked to refactor the stories file of a referenced component to use the design-system-demo components in `projects/shared-ui/src/lib/example/design-system-demo/`, replacing the older `org-storybook-example-container` / `org-storybook-example-container-section` pattern.

The prompt provides the directory of the component to refactor.

# Scope
- **ONLY** refactor the development stories file: `{component-name}.stories.ts`.
- **NEVER** touch `.tests.stories.ts` or `.use-cases.stories.ts`.

# Available design-system-demo components
You may use these and **ONLY** these (in `projects/shared-ui/src/lib/example/design-system-demo/`):
- `org-design-system-demo` — outer frame; slot-based composition (`header`, `controls`, `canvas`, `annotation`).
- `org-design-system-demo-header` — title + description + optional eyebrow.
- `org-design-system-demo-controls` — projection container for toggles / buttons (renders with elevated background, border, and rounded corners).
- `org-design-system-demo-canvas` — dashed-bordered visual stage.
- `org-design-system-demo-control-group` — labeled wrapper for a single control inside `org-design-system-demo-controls`.
- `org-design-system-demo-expected-behaviour` — "Expected behaviour" block rendered beneath an `org-design-system-demo`.

If a new sub-component appears necessary, you **MUST** ask the user before creating it. **NEVER** create new design-system-demo sub-components without explicit approval.

# Story categorization
Inspect every existing exported story and categorize each as exactly one of:
1. **Default** — the auto-controls story bound to the component's `args` / `argTypes`. **NEVER** modify this story.
2. **Live demo candidate** — only relevant if the component has more than one visual or functional input (color, size, variant, disabled, loading, etc.).
3. **Variant comparison** — stories that compare multiple options of one or more visual axes (color variants, size variants, state variants, etc.).
4. **Interactive isolation** — stories whose render uses a dedicated wrapper class with template variable bindings (e.g. `#someRef`) and demonstrates a runtime computed signal (e.g. `.isPressed()`, `.isFocused()`).
5. **Custom** — anything else (unusual stories that don't fit categories 1-4); ask the user how to handle case-by-case.

# Migration patterns (applied to category-3 stories AND category-4 wrapper components)
- `<org-storybook-example-container title="X" currentState="Y">` → `<org-design-system-demo>` with a child `<org-design-system-demo-header slot="header" title="X" />`. **DROP** `currentState` text.
- `<org-storybook-example-container-section label="...">` → strip the wrapper element and the `label`. The inner content moves directly inside `<org-design-system-demo-canvas slot="canvas">`. The canvas stacks children vertically by default; **PRESERVE** any inner layout wrappers (e.g. `<div class="flex gap-2">`) used to group multiple elements in one row.
- `<ul expected-behaviour>` → wrap in `<org-design-system-demo-expected-behaviour>`. **DROP** the `expected-behaviour` attribute and the `mt-1` utility class from the `<ul>`. **KEEP** `list-inside list-disc flex flex-col gap-1` on the `<ul>`.
- Wrap the `<org-design-system-demo>` + `<org-design-system-demo-expected-behaviour>` pair in a single `<div class="flex flex-col gap-4">`.

# Showcase merge rules
- Merge **ALL** category-3 stories into a single `Showcase` story export, **even when only one category-3 story exists** (naming consistency across components).
- The Showcase template wraps **all** sections in one `<div class="flex flex-col gap-4">`. Each section is a `<org-design-system-demo>` directly followed by its `<org-design-system-demo-expected-behaviour>` — flat siblings, no extra nesting per section.
- Each section's header title preserves the old container's `title` value (e.g., "Color Variants", "Size Variants").
- The Showcase render's `moduleMetadata.imports` array must include **every** internal `org-*` component referenced in the merged templates.
- **DELETE** the old category-3 story exports after merging into Showcase.
- The Showcase story description should summarize all merged axes (e.g., "Comprehensive showcase of every X variant axis — color, size, state, …").

# Live Demo rules
- Create a `LiveDemo` story **ONLY** if the component has more than one visual or functional input.
- Define a wrapper class decorated with `@Component({ selector: 'story-{component}-live-demo', ... })` directly inside the stories file (do **NOT** export it).
- The wrapper imports `ReactiveFormsModule` and uses a single `FormGroup` whose controls correspond to the component inputs being demonstrated.
- The wrapper template renders one `<org-design-system-demo>` with:
  - `<org-design-system-demo-header slot="header" title="Live demo" description="All <X> below are real and interactive — hover, focus, press, or tab through them to see every state." />`.
  - `<org-design-system-demo-controls slot="controls">` containing one `<org-design-system-demo-control-group label="...">` per input. Inside each control group:
    - For multi-option string inputs (color, size, variant, …) — use `<org-button-toggle [items]="..." formControlName="..." buttonSize="sm" />`.
    - For boolean inputs (disabled, loading, …) — use `<org-checkbox-toggle name="live-demo-X" value="X" formControlName="X">{{ form.controls.X.value ? 'on' : 'off' }}</org-checkbox-toggle>`.
    - For complex inputs (e.g., icon position with discrete choices: none / leading / trailing / both / only) — define a string-literal type, build a `ButtonToggleItem[]` array, and use `<org-button-toggle>`.
  - `<org-design-system-demo-canvas slot="canvas">` containing the live preview wrapped in a centered stage (a `<div>` with `display: flex; align-items: center; justify-content: center; min-height: 6rem;` styled inline via the wrapper's `styles: [...]` block).
- The wrapper renders the live component using `@switch` / `@if` over the form controls when needed (e.g., for icon-position variations).
- The exported `LiveDemo: Story` simply renders the wrapper: `template: '<story-{component}-live-demo />'` with `moduleMetadata.imports: [WrapperClass]`.
- Position the `LiveDemo` export directly after `Default`.

# Interactive isolation rules (category-4)
- Migrate the wrapper class's template to use `org-design-system-demo` per the migration patterns above.
- **KEEP** the story export as its own top-level export (do **NOT** merge into Showcase).
- Preserve the original story name (e.g., `PressedState`, `FocusedState`).

# Imports cleanup
After all migrations, scan the stories file and remove any imports that are no longer referenced. Most commonly:
- `StorybookExampleContainer` from `'../../private/storybook-example-container/storybook-example-container'`.
- `StorybookExampleContainerSection` from `'../../private/storybook-example-container-section/storybook-example-container-section'`.

# Verification
After making code changes:
- Run type-check via `moon shared-ui:type-check` (or `$workspaceRoot/node_modules/.bin/ngc --project projects/shared-ui/tsconfig.lib.prod.json`). Verify the migrated file produces no new errors. Pre-existing errors elsewhere are acceptable; identify and call them out.
- If storybook is running locally on port 9009, fetch `http://localhost:9009/index.json` and confirm the expected story IDs are registered (`{component}--default`, `{component}--live-demo` if applicable, `{component}--showcase` if any category-3 stories existed, plus any preserved isolation stories).
- **NEVER** claim visual rendering success without browser verification. If you cannot view the page in a browser, explicitly call out this limitation in the final summary.

# Reference example
Use `projects/shared-ui/src/lib/core/button/button.stories.ts` as the canonical reference for:
- The `Showcase` story structure (multi-section, single wrapper div, flat siblings).
- The `LiveDemo` wrapper component pattern (FormGroup, control-group, canvas with centered stage, `@switch` for discrete-choice rendering).
- The interactive isolation pattern (`PressedState`, `FocusedState` wrapper classes).

# Plan & ask-first
You **MUST** present your plan before making **ANY** code changes:
1. List every existing exported story and its assigned category.
2. State the planned final list of story exports after migration (typically: `Default`, `LiveDemo` if applicable, `Showcase` if applicable, plus any preserved category-4 isolation stories).
3. For `LiveDemo`, list every input you'll bind to a control along with the chosen control type per input.
4. Call out any sub-component you believe is needed but not yet available, and ask whether to add it.
5. Wait for user confirmation before applying changes.
