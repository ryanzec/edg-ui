You are tasked with creating a tabs system primarily designed to allow different content to be displayed. A reference image has been upload to convey the general direction.

# Tabs component

## Requirements

The tabs component MUST follow these requirements:

- Inputs:
  - `value` | string (REQUIRED): The value of the tab that is active
  - `scrollable` | boolean (DEFAULT: false): Whether the tabs element allows the tab element inside it to be scrollable
- Outputs:
  - `tabSelected(value: string)`: Event fired when a tab is clicked on passing the value of that tab to the event

## Features

### Scrollability

When the `scrollable` input is set to `true`, the tabs component MUST allow the tabs to be scrollable. It MUST render icons (using the caret icons) on both side of the tabs that when clicked, auto scroll the tabs element 80% of the width of the tabs element total width. The icons that trigger the scrolling MUST be disabled when they would have no effect (disable the left icon when scrolled all the way to the left and the same for the right).

# Tab component

## Requirements

The tab component MUST follow these requirements:

- Inputs:
  - `value` | string (REQUIRED): The unique value for identifying this tab
  - `disabled` | boolean (DEFAULT: false): Whether or not the tab is disabled

## Features

### Disabled

If the `disabled` input is set to `true` then the tab component MUST do the following

- apply an the `--opacity-disabled` from `projects/shared-ui/src/lib/variables.css` to the entire tab
- prevent the Tabs component `tabSelected` from triggering when that tab is clicked on

## Design

The tabs MUST have a bottom border that are connection to all of Tab component borders and use the `--color-border` for inactive tabs and `--color-border-bold` for active tabs. The text for inactive tabs should be `--color-text-subtle` and for active tabs should be `--color-text`.
