# Angular mono repository

# Local Development Setup

- `moon setup`
- `moon :deps`
- `moon sync hooks`
- `moon :setup-certs`

## Angular dev tools

There are angular dev tools for chrome / firefox: https://angular.dev/tools/devtools

While at least in chrome, the extension might looks like it does not detect angular being used, if you open the inspector the angular tab does work and show angualr data

### Storybook

For storybook, the angular extension (at least for chrome) does not seem to work properly so if you want to debug storybook, you can use the `ng.getComponent($0)` (making sure you have the host element selected) to access similar information even if it is not as an easy experience to work with.

# Projects

## Customer portal

Customer facing application

Angular specific

## Internal portal

Internal only application

Angular specific

## Shared types

General types that should be consumable by frontend and backend applications

Generic typescript

## Shared UI

General and domain specific ui components / functionality that should be reusable in an Angular based application.

Angular specific

## Shared utils

General utilty functionality that should be consumable by frontend and backend applications

Generic typescript

# Setup

- `moon:setup`
- `moon :deps`
- `moon sync hooks`

# Tooling

- Moon
- PNPM
- Angular 21
- Vitest
- Storybook
- Eslint / Prettier
- Angular CDK 21
- Luxon
- es-toolkit
- Chart.js
- Zod
- Lucide Icons
- Shiki
- ngx-scrollbar

# Todo

- @ViewChild() `static: true` only if accessed in `ngOnInit()`
- review all usage of cssUtils.merge and ideally remove them all.
- scrollend event auto scroll investigation
- convert @ViewChild() to viewChild() (which is signals based)
- review ability for each component to be able to make use of angular aria
- refactor css to use utility class when possible over custom css classes
- review sub component exports and remove ones that are internal (ie. card sub component are good but combobox sub components are not)
- figure out pattern for contianer query (integration list)

To save:

- refactor all component that accept `null` and `undefined` to only accept `undefined` (and default to that is previous default was `null`) and add an input trasnfrom to allow `null` to be passed but have it converted to `undefined`.
- refactor all component that accept only one of `null` or `undefined` (in additional to other value) to only accept `undefined` (and default to that is previous default was `null`) and add an input trasnfrom to allow `null` to be passed but have it converted to `undefined`.

# Feature to add

- checbox custom icon
- checkbox color support

---

you are tasked to add an input() to CHECKBOX of `iconName` that is used for the icon when it is checkbox is checked. also all an `iconColor` input() that is also passed to the icon component setting the default to

Add a story
