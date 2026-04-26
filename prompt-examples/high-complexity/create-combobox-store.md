You are tasked with creating a combobox store that is design to manage the data for a single / mutli select combobox / auto complete.

# Feature

## Value Selection

The store MUST keep track of the selected value(s) for the combobox. Even thought the selection can be a single or multiple selection, the value MUST always be an array even when it is a single selection order to keep the api simplier and consistent.

When a selected value is updated, the follow much be update too:

- for single selection, if the value attempted to being set as the selected is an array of more that one value, log an error with the LogManager and set the selected to an array of just the first value
- for single selection, update the input value to the be `label` of the selected option
- for multiple selection when the selected value changs, clear the input value

## Options

The store must manage the options for the selection of the combobox. The option can be passed in when the store is created or updated by a method as needed. Options MUST support AT LEAST for the follow data:
`label` type: `string` (REQUIRED): The string value representing the option
`value` type `string | number` (REQUIRED): The internal unique value for the option
`disabled` type `boolean` (DEFAULT: `false`): Whether the option should be selectable
`groupLabel` type : `string` (DEFAULT: `Uncategorized`): How the option should be grouped

When option are being passed to the store (weather when creating or updating), if the option does not have a value for a defaultable one, make sure to se that default value.

Before storing the options, they MUST be alha sorting by the `label` property of the options.

The store MUST also support getting the option in a readonly manner that can return all options, filtered options, grouped options, and filtered group options.

## Filtering Options

The store MUST support internal and external filtering.

### Internal

The store MUST allow for an option that can be is passed at creation of the store and through a method so it can be changed later that tell the store that when filtering, whether or not to filter out already selected values.

### External

The store MUST allow for a option that can be is passed at creation of the store and through a method so it can be changed later that is a filter method that take in the currnt input value (which is tracked by this store) and a combobox option and returns a boolean on whether it passed filtering and if it does pass, it MUST be included in the filtered options.

## Grouping

The store MUST support the ability to group options together. Each option will have a `groupLabel` that is to be use to group option together. When returning the grouped object, they MUST be returned as an array of objects of the format:

```
{
    groupLabel: string;
    options: ComboboxOption[],
}
```

and the array MUST order them my alpha of the `groupLabel`

## Focused option

The store MUST keep track of the focused option and have an api to be able to get and set this value externally. there should also be a method to get the focused option index in the list of option and a method to get the focused option group index which would return an object of `{ groupIndex: number, optionIndex: number }`

## Input value

The store MUST be able to keep track the in "input" value and have an api to be able to get and set this value externally.

The store must exposed an `output()` event that triggers when the input value changes passing the value of the input
