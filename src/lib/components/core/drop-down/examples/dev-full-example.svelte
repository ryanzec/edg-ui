<script lang="ts">
  import { createDropdownMenu } from '@melt-ui/svelte';
  import { writable } from 'svelte/store';
  import DropDownTrigger from '$lib/components/core/drop-down/drop-down-trigger.svelte';
  import DropDownSeparator from '$lib/components/core/drop-down/drop-down-separator.svelte';
  import DropDownItem from '$lib/components/core/drop-down/drop-down-item.svelte';
  import DropDownCheckboxItem from '$lib/components/core/drop-down/drop-down-checkbox-item.svelte';
  import DropDownSubTrigger from '$lib/components/core/drop-down/drop-down-sub-trigger.svelte';
  import DropDownRadioGroup from '$lib/components/core/drop-down/drop-down-radio-group.svelte';
  import DropDownRadioGroupLabel from '$lib/components/core/drop-down/drop-down-radio-group-label.svelte';
  import DropDownSubMenu from '$lib/components/core/drop-down/drop-down-sub-menu.svelte';
  import DropDownMenu from '$lib/components/core/drop-down/drop-down-menu.svelte';
  import AlignJustifiedIcon from '$lib/components/core/icons/align-justified-icon.svelte';
  import { dropDownUtils } from '$lib/components/core/drop-down/utils';

  const settingsSync = writable(true);
  const hideMeltUI = writable(false);
  const radioValue = writable('Hunter Johnston');

  const {
    elements: { trigger, menu, item, separator },
    builders: { createSubmenu, createMenuRadioGroup, createCheckboxItem },
    states: { open },
  } = createDropdownMenu(dropDownUtils.buildCreateOptions());

  const {
    elements: { subMenu, subTrigger },
    states: { subOpen },
  } = createSubmenu();

  const {
    elements: { radioGroup, radioItem },
    helpers: { isChecked },
  } = createMenuRadioGroup({ value: radioValue });

  const { elements: { checkboxItem } } = createCheckboxItem({ checked: settingsSync });

  const { elements: { checkboxItem: checkboxItemA } } = createCheckboxItem({ checked: hideMeltUI });

  const personsArr = ['Hunter Johnston', 'Thomas G. Lopes', 'Adrian Gonz', 'Franck Poingt'];
</script>

<h1>Drop Downs</h1>
<DropDownTrigger class="absolute left-[400px] top-[400px] cursor-pointer" meltTrigger={trigger}>
  <AlignJustifiedIcon class="m-2 size-4" />
</DropDownTrigger>
<DropDownMenu isOpened={open} meltMenu={menu}>
  <DropDownItem meltItem={$item} onclick={() => console.log('about melt ui')}>About Melt UI</DropDownItem>
  <DropDownItem meltItem={$item}>Check for Updates..</DropDownItem>
  <DropDownSeparator meltSeparator={separator} />
  <DropDownCheckboxItem item={$checkboxItem} checked={settingsSync}>Settings Sync is On</DropDownCheckboxItem>
  <DropDownSubTrigger {subTrigger}>Profiles</DropDownSubTrigger>
  <DropDownSubMenu {subMenu} isOpened={subOpen}>
    <DropDownRadioGroupLabel>People</DropDownRadioGroupLabel>
    <DropDownRadioGroup
      meltRadioGroup={radioGroup}
      meltRadioItem={radioItem}
      {isChecked}
      value={radioValue}
      options={personsArr}
    />
  </DropDownSubMenu>
  <DropDownSeparator meltSeparator={separator} />
  <DropDownCheckboxItem item={$checkboxItemA} checked={hideMeltUI}>
    Hide Melt UI
    {#snippet rightContent()}
      ⌘H
    {/snippet}
  </DropDownCheckboxItem>
  <DropDownItem meltItem={$item} disabled>
    Show All Components
    {#snippet rightContent()}
      ⇧⌘N
    {/snippet}
  </DropDownItem>
  <DropDownSeparator meltSeparator={separator} />
  <DropDownItem meltItem={$item}>
    Quit Melt UI
    {#snippet rightContent()}
      ⌘Q
    {/snippet}
  </DropDownItem>
</DropDownMenu>
