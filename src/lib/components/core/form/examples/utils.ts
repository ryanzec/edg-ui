import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import DevArrayExample from '$lib/components/core/form/examples/dev-array-example.svelte';
import DevCheckboxExample from '$lib/components/core/form/examples/dev-checkbox-example.svelte';
import DevCheckboxIndeterminateExample from '$lib/components/core/form/examples/dev-checkbox-Indeterminate-example.svelte';
import DevComboboxMultipleExample from '$lib/components/core/form/examples/dev-combobox-multiple-example.svelte';
import DevComboboxSingleExample from '$lib/components/core/form/examples/dev-combobox-single-example.svelte';
import DevCompleteExample from '$lib/components/core/form/examples/dev-complete-example.svelte';
import DevCompletePrepopulatedExample from '$lib/components/core/form/examples/dev-complete-prepopulated-example.svelte';
import DevNestedExample from '$lib/components/core/form/examples/dev-nested-example.svelte';
import DevObjectExample from '$lib/components/core/form/examples/dev-object-example.svelte';
import DevRadioExample from '$lib/components/core/form/examples/dev-radio-example.svelte';
import DevSelectExample from '$lib/components/core/form/examples/dev-select-example.svelte';
import DevTextExample from '$lib/components/core/form/examples/dev-text-example.svelte';
import DevTextareaExample from '$lib/components/core/form/examples/dev-textarea-example.svelte';
import DevToggleExample from '$lib/components/core/form/examples/dev-toggle-example.svelte';
import DevFormErrorsExample from '$lib/components/core/form/examples/dev-form-errors-example.svelte';
import DevValidateOnBlurExample from '$lib/components/core/form/examples/dev-validate-on-blur-example.svelte';

export const formExampleItems: DevNavigationItem = {
  display: 'Form',
  items: [
    {
      display: 'Complete',
      component: DevCompleteExample,
    },
    {
      display: 'Complete Prepopulated',
      component: DevCompletePrepopulatedExample,
    },
    {
      display: 'Validate on Blur',
      component: DevValidateOnBlurExample,
    },
    {
      display: 'Form Errors',
      component: DevFormErrorsExample,
    },
    {
      display: 'Input Types',
      items: [
        {
          display: 'Array',
          component: DevArrayExample,
        },
        {
          display: 'Checkbox',
          component: DevCheckboxExample,
        },
        {
          display: 'Checkbox Intermediate',
          component: DevCheckboxIndeterminateExample,
        },
        {
          display: 'Combobox Multiple',
          component: DevComboboxMultipleExample,
        },
        {
          display: 'Combobox Single',
          component: DevComboboxSingleExample,
        },
        {
          display: 'Nested',
          component: DevNestedExample,
        },
        {
          display: 'Object',
          component: DevObjectExample,
        },
        {
          display: 'Radio',
          component: DevRadioExample,
        },
        {
          display: 'Select',
          component: DevSelectExample,
        },
        {
          display: 'Text',
          component: DevTextExample,
        },
        {
          display: 'Textarea',
          component: DevTextareaExample,
        },
        {
          display: 'Toggle',
          component: DevToggleExample,
        },
      ],
    },
  ],
};
