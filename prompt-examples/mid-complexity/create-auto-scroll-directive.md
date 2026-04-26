You are task with creating an auto scroll directive that is used to apply auto scrolling behavior to an element

# Types

```ts
export type AutoScrollState = 'enabled' | 'disabled' | 'forced-disabled';

export type AutoScrollScrollToBottomOptions = {
  onAfterScroll: () => void;
};
```

# Requirements

You MUST follow these requirements:

- inputs:
  - `autoScrollEnabled` type boolean (DEFAULT to `true`):
- minimal internal state (more can be added based on needs of functionality implemented)
  - `autoScrollState` type AutoScrollState: determines if how the auto scrolling functionality is handled, MUST defaults to `enabled` if `autoScrollEnabled` is `true`, MUST default to `forced-disabled` if `autoScrollEnabled` is `false`

# Functionality

## Public api

The directive must expose the follow api so that parent component can trigger them:

- `setAutoScrollState(newState: AutoScrollState)` - new the internal state's `autoScrollState` to a new value
- `getAutoScrollState()` - readonly value of the current state of the auto scroll
- `scrollToBottom(options: AutoScrollScrollToBottomOptions)` - triggers a programatic scroll of the element

## General idea

You MUST utilize the following techniques to implement this feature: `CdkObserveContent`, `ResizeObserver`, `IntersectionObserver`.

The general ideas is that when contents is added to the element with the directive, if the state of the scroll is enabled, the element MUST auto scroll to that end. The directive MUST also add a "sentinel" element at the end of it which MUST be used to contorl the state of the auto scroll functionality.

## Enabled input

If the `autoScrollEnabled` input changes from `true` to `false`, the internal state property `autoScrollState` MUST be switched to `forced-disabled`.

If the `autoScrollEnabled` input changes from `false` to `true`, the internal state property `autoScrollState` MUST be switched to thf ollow based on the rules:

- if the element to determine if the element is scrolled to the bottom

## Programatic vs user driven scroll detection

You MUST be able to track when a scroll is being done programatically vs when a user does it as it will have an effect of managing the auto scroll state management.

## Auto Scroll State Management

The `autoScrollState` property must be managed with this rules:

- if the `autoScrollEnabled` input changes from `true` to `false`, set `autoScrollState` to `forced-disabled`.
- if the `autoScrollEnabled` input changes from `true` to `false`, set `autoScrollState` to `enabled`.
- when the intersection event triggers, if the auto scroll state is set to `forced-disabled` OR the scroll is a programmatic one, no change MUST happen
- when the intersection event triggers, if the auto scroll state is NOT set to `forced-disabled` AND the scroll is a NOT programmatic one, the auto scroll state MUST be change to `enabled` is the intersecting state is `true` or set the auto scorll state to `disabled` is the intersecting state is `false`

## Auto scrolling

When the auto scroll state is set to `enabled` and new content is detected, the element MUST scroll to the bottom of the element
