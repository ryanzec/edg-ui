---
name: unit-testing-browser
description: Use this skill whenever being asked to write unit style tests for angular components, angular directives, or any code that requires a browser to properly test.
---
# Unit Testing Browser

You are tasked to create unit style tests utilizing vitest's browser mode.

# MUST FOLLOW RULES

- All generic code that might apply to any vitest browser test needs to be add to `` so it is re-usable.
- **ALWAYS** favor stub when they are more realiable (since these are effectively unit tests).

# General Testing Guidelines

- **ALWAYS** park the virtual cursor on the trigger input before opening a CDK overlay in vitest browser tests (e.g. `await userEvent.hover(input)` then focus), since the cursor stays where the last `userEvent` left it and an overlay opening beneath it fires a stray `mouseenter` that focuses whatever option sits under the cursor and corrupts keyboard-nav/focus assertions.

# Fixture Creation Pattern

Test the component through a small host wrapper. Bind inputs to public signals and select via `data-testid`. Shared scaffolding lives in the root `vitest-browser-utils.ts` — never re-implement it in a spec.

## Setup

Import `vitestBrowserUtils` and pull the per-describe harness off it:

```ts
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';

describe('Component (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  beforeEach(setupTestBed);
  afterEach(destroyFixture);
});
```

The harness provides: `createFixture(component, configure?)`, `flush(fixture)`, `waitFor(assertion)`, `queryByTestId(fixture, testId)`, `setupTestBed`, `destroyFixture` (it tracks the active fixture so cleanup is automatic). `vitestBrowserUtils.focusInput(host, selector)` hovers + focuses an input. Add per-component helpers (overlay queries, etc.) locally.

## 1. Config object — set inputs at creation

A typed per-component helper applies inputs through `createFixture`'s `configure` callback, which runs *before* the first change detection (so reflection asserts need no flush).

```ts
type BoxHostConfig = { color?: BoxColor | null; border?: BoxBorder };

const createInteractiveBox = (config: BoxHostConfig = {}): ComponentFixture<BoxInteractiveHost> =>
  createFixture(BoxInteractiveHost, (instance) => {
    if (config.color !== undefined) {
      instance.color.set(config.color);
    }
    if (config.border !== undefined) {
      instance.border.set(config.border);
    }
  });

// usage
const fixture = createInteractiveBox({ color: 'danger' });
```

Use `!== undefined` so `null` is still applied. Add a field per visible input.

## 2. Instance access — mid-test changes

Anything not set-once-before-interacting goes through `fixture.componentInstance`:

```ts
fixture.componentInstance.color.set(null);                              // transition
fixture.componentInstance.comboboxComponent().setSelectedOptions(['a']); // imperative API
fixture.componentInstance.formControl.setValue(['a']);                   // reactive form
```

Expose imperative APIs via a public viewChild on the host: `public readonly comboboxComponent = viewChild.required(Combobox);`

## 3. Readout element — assert non-DOM state

For state not visible in the DOM (output emissions, counts, internal/brain state), render one flat string and assert with `toContain` (string pattern, not JSON — avoids whitespace brittleness).

```ts
// template
<pre data-testid="readout">{{ readout() }}</pre>

// host
protected readout(): string {
  return `selectedValues=[${this.lastSelected().join(',')}] changeCount=${this.changeCount()}`;
}
protected onSelectedChanged(values: string[]): void {
  this.lastSelected.set(values);
  this.changeCount.update((count) => count + 1);
}

// test
expect(readout.textContent).toContain('selectedValues=[a]');
```

Track outputs with last-value / count signals updated by `(output)` handlers; read brain state via a viewChild. Prefer asserting real DOM (`data-*`/`aria-*`/text/value) where it exists.
`
