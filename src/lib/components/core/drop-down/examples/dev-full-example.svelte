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
  import Icon from '$lib/components/core/icons/icon.svelte';
  import { dropDownUtils } from '$lib/components/core/drop-down/utils';
  import { IGNORE_DATA_ATTRIBUTE_NAME } from '$lib/actions/click-outside-action';

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

  const {
    elements: { checkboxItem },
  } = createCheckboxItem({ checked: settingsSync });

  const {
    elements: { checkboxItem: checkboxItemA },
  } = createCheckboxItem({ checked: hideMeltUI });

  const personsArr = ['Hunter Johnston', 'Thomas G. Lopes', 'Adrian Gonz', 'Franck Poingt'];

  const {
    elements: { trigger: trigger2, menu: menu2, item: item2 },
    states: { open: open2 },
  } = createDropdownMenu(dropDownUtils.buildCreateOptions());

  const dropDown1Id = 'drop-down-1';
  const dropDown1Attributes = { [IGNORE_DATA_ATTRIBUTE_NAME]: dropDown1Id };

  const dropDown2Id = 'drop-down-2';
  const dropDown2Attributes = { [IGNORE_DATA_ATTRIBUTE_NAME]: dropDown2Id };
</script>

<h1>Drop Downs</h1>
<DropDownTrigger
  class="absolute top-[400px] left-[400px] cursor-pointer"
  meltTrigger={trigger}
  isOpened={open}
  id={dropDown1Id}
>
  <Icon icon="align-justified" class="m-xs" />
</DropDownTrigger>
<DropDownMenu isOpened={open} meltMenu={menu} {...dropDown1Attributes}>
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

<DropDownTrigger
  class="absolute top-[440px] left-[400px] cursor-pointer"
  meltTrigger={trigger2}
  isOpened={open2}
  id={dropDown2Id}
>
  <Icon icon="align-justified" class="m-xs" />
</DropDownTrigger>
<DropDownMenu isOpened={open2} meltMenu={menu2} {...dropDown2Attributes}>
  <DropDownItem meltItem={$item2} onclick={() => console.log('about melt ui')}>About Melt UI</DropDownItem>
  <DropDownItem meltItem={$item2}>Check for Updates..</DropDownItem>
</DropDownMenu>
