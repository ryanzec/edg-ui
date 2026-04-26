You are tasked with creating a calendar component designed to be used in various location where a calendar can be used. I have attached an image of the basic structure.

# Requirements

This component MUST follow these REQUIREMENTS:

- MUST utilize luxon for an date related functionality
- MUST have the following inputs
  - `defaultDisplayDate` type luxon DateTime (DEFAULT to current day): used to properly the internal state of the current display year / month and then NOT used after or for anything else
  - `startYear` type `number` (DEFAULT current year - 100): the earliest selectable year in the drop down for year
  - `endYear` type `number` (DEFAULT current year + 20): the latest selectable year in the drop down for year
  - `selectedStartDate` type luxon `DateTime` | `null` (DEFAULT `null`): the selected start date
  - `selectedEndDate` type luxon `DateTime` | `null` (DEFAULT `null`): the selected end date
  - `allowRangeSelection` type boolean (DEFAULT to `false`): determine logic when a date is selected
  - `disableBefore` type luxon DateTime | `null` (DEFAULT to `null`): disable all date before this date
  - `disableAfter` type luxon DateTime | `null` (DEFAULT to `null`): disable all date after this date
  - `allowedDateRange` type number (DEFAULT to 0): used to disabled dates when range selection is enabled
- MUST have the following `output()` events:
  - `dateSelected (startDate: DateTime, endDate: DateTime)`: triggered when either selected date is changed and passes both selection dates in the event
  - `displayMonthChanged (currentMonth: number, currentYear: number, previousMonth: number, previousYear: number)`: triggered when the display month changes

# Design

## Header

This MUST be its own sub-component in the calendar directory (following the same patterns as `projects/shared-ui/src/lib/core/card`).

The header part of the calendar MUST contain a drop down for year (desc order), and drop down for month (jan - dec), and back / forward arrows (using the caret icons) that are clickable.

## Dates

This MUST be its own sub-component in the calendar directory (following the same patterns as `projects/shared-ui/src/lib/core/card`).

The dates section MUST have a 7 column grid where:

- the first row elements are single capital letters representing the day of the week from Sunday (left) to Saturday(right)
- the following rows are the day of the month(s) for the corrispending position
- if there are positions for the dates outside the current month, the date MUST still be shown and selectable however the element MUST have use the design token `--opacity-subtle` on it
- dates in the current month MUST be displayed as normal
- selected dates but have a selected background color
- if `allowRangeSelection` is `true` and there is a both a `selectedStartDate` and `selectedEndDate`, all dates inbetween MUST have the selected background
- all date before `disableBefore` (if given) or after `disableAfter` (if given) must be given the `--opacity-disabled` design system token on the date element
- if `allowRangeSelection` is `true` and `allowedDateRange` is greater than `0`, then when there is a start date selected, all dates starting from the selected date to beyond the allowed range MUST be disabled (so if the range is 14 and I select `1/1/20`, all date starting at and after `1/15/20` MUST be disabled)

## Footer

This MUST be its own sub-component in the calendar directory (following the same patterns as `projects/shared-ui/src/lib/core/card`).

This is a generic component that can pretty much have anything in it.

# Features

## API

It MUST expose the following public api

- a method to set the current display date (it just takes that date and updates the internal state for this data)

## Calendar controls

- the year drop down in the header updates the display year
- the month drop down in the header updates the display month
- the left caret icon in the header moves back 1 month
- the right caret icon in the header moves forward 1 month
- when you click on a date when no date is select, that become the `selectedStartDate`
- when you click on a date when `selectedStartDate` is already populated and `allowRangeSelection` is `false`, the date clicked become the new `selectedStartDate`
- when you click on a date when `selectedStartDate` is already populated and `allowRangeSelection` is `true` and there is no `selectedEndDate`, the date clicked become the `selectedEndDate`
- when you click on a date when `selectedStartDate` and `selectedEndDate` are already populated and `allowRangeSelection` is `true`, you have to do the follow checks:
  -- if the clicked date match either the `selectedStartDate` or `selectedEndDate`, do nothing
  -- if the clicked date is after the current `selectedStartDate`, the clicked date becomes the new `selectedEndDate`
  -- if the clicked date is before the current `selectedStartDate`, the current `selectedStartDate` becomes the new `selectedEndDate` and the clicked date becomes the new `selectedStartDate`

---

You are tasked with creating a date picker component that is designed for date selection in the context of a form.

# Requirements

You MUST follow these REQUIREMENTS:

- MUST support both reactive form and simple forms (like how `projects/shared-ui/src/lib/core/combobox` does it)
- MUST use CDK for the overlay functionality
- MUST use the `projects/shared-ui/src/lib/core/calendar` component for the date selection functinality
- MUST use the `projects/shared-ui/src/lib/core/input` component for the input display
- MUST have the follow custom inputs:
  - `dateFormat` type `DateFormat` (DEFAULT: `DateFormat.STANDARD`): the date part of the format for the display in the input
  - `timeFormat` type `TimeFormat` (DEFAULT: `TimeFormat.STANDARD`): the time part of the format for the display in the input
  - `allowPartialRangeSelection` type boolean (DEFAULT to `false`): used in determining how to display the input value
- the date picker component MUST have the follow inputs that are just proxied to the input component:
  - `placeholder`
  - `autoFocus`
  - `validationMessage`
- the date picker component MUST have the following inputs that are just proxied to the calendar component:
  - `defaultDisplayDate`
  - `startYear`
  - `endYear`
  - `selectedStartDate`
  - `selectedEndDate`
  - `allowRangeSelection`
  - `disableBefore`
  - `disableAfter`
  - `allowedDateRange`
- make the following output event from the input component attachable from the date picker component
  - `focused`
  - `blurred`
  - `dateSelected`
- make sure to have a story the demos the reactive form and simple form functionality
- MUST have a story the has validation where both dates are required
- MUST have a story that has validation where only 1 date is required

# Design

## Input

the main input of of the date picker is just the `projects/shared-ui/src/lib/core/input` with the follow property automatically set:

- the `preIcon` is `calendar`
- the `postIcon` is a drop down caret

## Calendar

the calendar is just using the `projects/shared-ui/src/lib/core/calendar` component and displaying it in an angular CDK overlay that is attacked to the input. the postion of the overlay should be default be aligning the top of the overlay to the bottom of the input and the start of the overlay to the start of the input. the fallback for the x axis is to align the end of the overlay to the end of the input. the fallback for the y axis is to align the bottom of the overlay with the top of the input.

# Functionality

## Public API

expose the following public apis from the date picket component:

- `getSelectedDates`: proxies the same method from the calendar component

## Input Value

the value of the input MUST be populate using the following of the logic:

- if `allowRangeSelection` is `false`:
  -- there is no `selectedStartDate`, the placeholder should display
  -- there is a `selectedStartDate`, the input should display that date formatted
- if `allowRangeSelection` is `true`:
  -- there is no `selectedStartDate` or `selectedEndDate`, the placeholder should display
  -- there is a `selectedStartDate` but no end date and `allowPartialRangeSelection` is false, the input should display that date formatted with a trailing `-` like `{FORMATTED START DATE} - `
  -- there is a `selectedStartDate` but no end date and `allowPartialRangeSelection` is true, the input should display that date formatted with an after at like `On or after {FORMATTED START DATE}`
  -- there is a `selectedEndDate` but no start date and `allowPartialRangeSelection` is false, the input should display that date formatted with a preceeding `-` like ` - {FORMATTED END DATE}`
  -- there is a `selectedEndDate` but no start date and `allowPartialRangeSelection` is true, the input should display that date formatted with an before at like `On or before {FORMATTED END DATE}`
  -- there are both `selectedStartDate` and `selectedEndDate` set, the input should display both dates formatted like `On or before {FORMATTED START DATE} - {FORMATTED END DATE}`
