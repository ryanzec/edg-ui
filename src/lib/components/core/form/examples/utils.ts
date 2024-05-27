import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import FormArrayExample from '$lib/components/core/form/examples/form-array-example.svelte';
import FormCheckboxExample from '$lib/components/core/form/examples/form-checkbox-example.svelte';
import FormComboboxMultipleExample from '$lib/components/core/form/examples/form-combobox-multiple-example.svelte';
import FormComboboxSingleExample from '$lib/components/core/form/examples/form-combobox-single-example.svelte';
import FormCompleteExample from '$lib/components/core/form/examples/form-complete-example.svelte';
import FormCompletePrepopulatedExample from '$lib/components/core/form/examples/form-complete-prepopulated-example.svelte';
import FormNestedExample from '$lib/components/core/form/examples/form-nested-example.svelte';
import FormObjectExample from '$lib/components/core/form/examples/form-object-example.svelte';
import FormRadioExample from '$lib/components/core/form/examples/form-radio-example.svelte';
import FormSelectExample from '$lib/components/core/form/examples/form-select-example.svelte';
import FormTextExample from '$lib/components/core/form/examples/form-text-example.svelte';
import FormTextareaExample from '$lib/components/core/form/examples/form-textarea-example.svelte';
import FormValidateOnBlurExample from '$lib/components/core/form/examples/form-validate-on-blur-example.svelte';

export const formExampleItems: DevNavigationItem = {
  display: 'Form',
  items: [
    {
      display: 'Complete',
      component: FormCompleteExample,
    },
    {
      display: 'Complete Prepopulated',
      component: FormCompletePrepopulatedExample,
    },
    {
      display: 'Validate on Blur',
      component: FormValidateOnBlurExample,
    },
    {
      display: 'Input Types',
      items: [
        {
          display: 'Array',
          component: FormArrayExample,
        },
        {
          display: 'Checkbox',
          component: FormCheckboxExample,
        },
        {
          display: 'Combobox Multiple',
          component: FormComboboxMultipleExample,
        },
        {
          display: 'Combobox Single',
          component: FormComboboxSingleExample,
        },
        {
          display: 'Nested',
          component: FormNestedExample,
        },
        {
          display: 'Object',
          component: FormObjectExample,
        },
        {
          display: 'Radio',
          component: FormRadioExample,
        },
        {
          display: 'Select',
          component: FormSelectExample,
        },
        {
          display: 'Text',
          component: FormTextExample,
        },
        {
          display: 'Textarea',
          component: FormTextareaExample,
        },
      ],
    },
  ],
};
