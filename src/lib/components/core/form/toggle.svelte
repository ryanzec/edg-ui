<script module lang="ts">
  export type CheckboxValue = boolean | 'indeterminate';
</script>

<script lang="ts">
  import { stringUtils } from '$lib/utils/string';
  import { twMerge } from 'tailwind-merge';

  interface Props {
    checked: boolean;
    name: string;
    id?: string;
    value: string;
    label?: string;
  }

  let {
    checked = $bindable(),
    name,
    id = name,
    value,
    label = value,
  }: Props = $props();

  const buttonCss = '';

  let checkedBarCss = $derived(checked ? 'bg-brand' : 'bg-neutral');
  let checkedButtonCss = $derived(checked ? 'translate-x-4' : '');
</script>

<label data-id="toggle" class="flex cursor-pointer items-center" for={id} id="{value}-label">
  <div
    data-id="bar"
    class={twMerge(
      'mr-1 inline-flex h-4 w-8 items-center rounded-3xl outline-none transition-colors duration-150',
      checkedBarCss,
      buttonCss,
    )}
  >
    <div class={twMerge('mx-0.5 block h-3 w-3 rounded-full bg-surface-base duration-150', checkedButtonCss)}></div>
  </div>
  <input {id} {name} type="checkbox" {value} bind:checked class="appearance-none" />
  {stringUtils.toTitleCase(label)}
</label>
