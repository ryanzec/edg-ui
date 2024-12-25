import DevColorsExample from '$lib/components/core/badge/examples/dev-colors-example.svelte';
import DevShapesExample from '$lib/components/core/badge/examples/dev-shapes-example.svelte';
import DevStrengthExample from '$lib/components/core/badge/examples/dev-strength-example.svelte';
import DevIconsExample from '$lib/components/core/badge/examples/dev-icons-example.svelte';
import type { DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';

export const badgeExampleItems: DevNavigationItem = {
  display: 'Badge',
  items: [
    {
      display: 'Colors',
      component: DevColorsExample,
    },
    {
      display: 'Shapes',
      component: DevShapesExample,
    },
    {
      display: 'Strength',
      component: DevStrengthExample,
    },
    {
      display: 'Icons',
      component: DevIconsExample,
    },
  ],
};
