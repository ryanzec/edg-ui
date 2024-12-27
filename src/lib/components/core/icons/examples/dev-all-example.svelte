<script lang="ts">
  import Icon, { IconColor, IconSize } from '$lib/components/core/icons/icon.svelte';
  import { iconComponents, type IconName } from '$lib/components/core/icons/utils';
  import Tooltip from '$lib/components/core/tooltip/tooltip.svelte';
  import TextInput from '$lib/components/core/form/text-input.svelte';
  import SelectLabel from '$lib/components/core/form/select-label.svelte';
  import Select from '$lib/components/core/form/select.svelte';
  import FormFields from '$lib/components/core/form/form-fields.svelte';
  import FormField from '$lib/components/core/form/form-field.svelte';
  import Label from '$lib/components/core/form/label.svelte';
  import { clipboardUtils } from '$lib/utils/clipboard';

  let allIconNames: IconName[] = Object.keys(iconComponents) as IconName[];
  let iconNames: IconName[] = $state(allIconNames);
  let filter = $state('');
  const colorOptions = [
    {
      display: 'Default (Default)',
      value: IconColor.DEFAULT,
    },
    {
      display: 'Brand',
      value: IconColor.BRAND,
    },
    {
      display: 'Neutral',
      value: IconColor.NEUTRAL,
    },
    {
      display: 'Success',
      value: IconColor.SUCCESS,
    },
    {
      display: 'Info',
      value: IconColor.INFO,
    },
    {
      display: 'Warning',
      value: IconColor.WARNING,
    },
    {
      display: 'Danger',
      value: IconColor.DANGER,
    },
  ];
  const sizeOptions = [
    {
      display: 'Extra Small',
      value: IconSize.EXTRA_SMALL,
    },
    {
      display: 'Small',
      value: IconSize.SMALL,
    },
    {
      display: 'Base (Default)',
      value: IconSize.BASE,
    },
    {
      display: 'Large',
      value: IconSize.LARGE,
    },
    {
      display: 'Extra Large',
      value: IconSize.EXTRA_LARGE,
    },
    {
      display: 'Extra Large 2',
      value: IconSize.EXTRA_LARGE2,
    },
    {
      display: 'Extra Large 3',
      value: IconSize.EXTRA_LARGE3,
    },
    {
      display: 'Extra Large 4',
      value: IconSize.EXTRA_LARGE4,
    },
  ];
  let color = $state(IconColor.DEFAULT);
  let size = $state(IconSize.LARGE);

  $effect(() => {
    iconNames = allIconNames.filter((iconName) => iconName.toLowerCase().includes(filter.toLowerCase()));
  });
</script>

<FormFields class="mb-base w-[500px]">
  <FormField>
    <Label>Search</Label>
    <TextInput name="filter" bind:value={filter} placeholder="Search by name..." />
  </FormField>
  <FormField>
    <Select name="color" defaultDisplay="Select color..." options={colorOptions} bind:value={color}>
      {#snippet label()}
        <SelectLabel>Color</SelectLabel>
      {/snippet}
    </Select>
  </FormField>
  <FormField>
    <Select name="size" defaultDisplay="Select size..." options={sizeOptions} bind:value={size}>
      {#snippet label()}
        <SelectLabel>Size</SelectLabel>
      {/snippet}
    </Select>
  </FormField>
</FormFields>
<div class="gap-sm flex items-center">
  {#each iconNames as iconName}
    <div class="flex flex-col items-center">
      <Tooltip offsetOptions={{ mainAxis: 5 }}>
        {#snippet handle()}
          <button
            class="bg-surface-pure p-xs cursor-pointer rounded-sm"
            onclick={() => clipboardUtils.copyToClipboard(iconName)}
          >
            <Icon icon={iconName} {color} {size} />
          </button>
        {/snippet}
        {#snippet content()}
          <div>{iconName}</div>
        {/snippet}
      </Tooltip>
    </div>
  {/each}
</div>
