<script lang="ts">
  import { usersTableExampleItems } from '$lib/components/application/users-table/examples/utils';
  import { badgeExampleItems } from '$lib/components/core/badge/examples/utils';
  import { buttonExampleItems } from '$lib/components/core/button/examples/utils';
  import { collapsibleExampleItems } from '$lib/components/core/collapsible/examples/utils';
  import { comboboxExampleItems } from '$lib/components/core/combobox/examples/utils';
  import DevNavigation, { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
  import { dialogExampleItems } from '$lib/components/core/dialog/examples/utils';
  import { dropDownExampleItems } from '$lib/components/core/drop-down/examples/utils';
  import { formExampleItems } from '$lib/components/core/form/examples/utils';
  import { peekExampleItems } from '$lib/components/core/peek/examples/utils';
  import { scrollAreaExampleItems } from '$lib/components/core/scroll-area/examples/utils';
  import { tooltipExampleItems } from '$lib/components/core/tooltip/examples/utils';

  const sortMenu = (a: DevNavigationItem, b: DevNavigationItem) => {
    if (a.display < b.display) {
      return -1;
    }

    if (a.display > b.display) {
      return 1;
    }

    return 0;
  };

  const sortItems = (items: DevNavigationItem[]) => {
    items.sort(sortMenu);

    for (let i = 0; i < items.length; i++) {
      if (!items[i].items?.length) {
        continue;
      }

      sortItems(items[i].items as DevNavigationItem[]);
    }
  };

  const items: DevNavigationItem[] = [
    buttonExampleItems,
    collapsibleExampleItems,
    dialogExampleItems,
    dropDownExampleItems,
    peekExampleItems,
    tooltipExampleItems,
    scrollAreaExampleItems,
    formExampleItems,
    comboboxExampleItems,
    usersTableExampleItems,
    badgeExampleItems,
  ];

  sortItems(items);
</script>

<div class="flex h-full w-full">
  <DevNavigation {items} />
  <slot />
</div>
