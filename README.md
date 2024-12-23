# EDG UI

A lightly opinionated Svelte / Sveltekit starter template.

This template is designed to be copied to start a repo and then it should diverge as needed. When updates are made to this repo, it is not expected for the change to be easily integrated into repo that started with this template.

# Libraries

This section talks about the include libraries.

## TypeScript

Most (if not all) code should be written in typescript so that is included.

## Vite 6

Used for building the code.

## Svelte 5 / Sveltekit 2

The primary libraries for the template. The frontend is handled by Svelte (using Sveltekit for routing) and Sveltekit can be used as a backend for the frontend solution too.

## Tailwind 4

Tailwind is included as the primary styling library. While I have a love / date relationship with Tailwind, the pros do outweigh the cons enough to include it.

## Melt UI

Melt UI is used for a number of component to make it easier to provide a11y functionality however just because Melt UI has a builder for something, it it not automatically used.

There are cases where the functionality in Melt UI is not used in favor of a custom solution when warranted. We do this for the combobox (as the typing in Melt UI for me was just way too complicated to get working) and tooltip (as there was a bug that has yet to be addressed).

Given the current state of Melt UI (not being 1.0 but not really progressing much), I would say Melt UI should only be used we time is an issue, otherwise a custom solution it probably better long term.

## Vitest 3

For running unit tests.

## Playwright

For running component / end to end tests.

## Husky

For enable git hooks.

## Eslint / Prettier

For auto formatting code on save / commit / push.

## Zod

For data validation.

# Development

## CSS Variables

In order to generate css variable, first you want to load the figma file is figma and then use the following plugin to convert the variables to json:

https://github.com/mark-nicepants/variables2json-docs

You can then take the export json and place it in the repo as `artifacts/figma-variables.json` and then run:

```
pnpm css:build-variables
```

Everything else is automatically setup to use the generated variables that command generates.

# Major Included Libraries



To use

- `pnpm install`
- `pnpm exec playwright install`
