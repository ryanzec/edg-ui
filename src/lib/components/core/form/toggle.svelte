<script module lang="ts">
  export type CheckboxValue = boolean | 'indeterminate';
</script>

<script lang="ts">
  import { stringUtils } from '$lib/utils/string';
  import { tailwindUtils } from '$lib/utils/tailwind';

  type Props = {
    checked: boolean;
    name: string;
    id?: string;
    value: string;
    label?: string;
  };

  let { checked = $bindable(), name, id = name, value, label = value }: Props = $props();

  const buttonCss = '';

  let checkedBarCss = $derived(checked ? 'bg-brand' : 'bg-neutral');
  let checkedButtonCss = $derived(checked ? 'translate-x-base' : '');
</script>

<label data-id="toggle" class="flex cursor-pointer items-center" for={id} id="{value}-label">
  <div
    data-id="inner"
    class={tailwindUtils.merge(
      'mr-2xs h-base inline-flex w-[32px] items-center rounded-full outline-hidden transition-colors duration-150',
      checkedBarCss,
      buttonCss,
    )}
  >
    <div
      class={tailwindUtils.merge('bg-surface mx-3xs h-sm block w-sm rounded-full duration-150', checkedButtonCss)}
    ></div>
  </div>
  <input {id} {name} type="checkbox" {value} bind:checked class="appearance-none" />
  {stringUtils.toTitleCase(label)}
</label>
