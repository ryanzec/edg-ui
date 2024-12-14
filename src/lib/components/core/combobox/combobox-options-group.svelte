<script lang="ts" generics="TOptionValue extends { display: string; value: string; }">
  /* global TOptionValue */
  import type { ComboboxStore } from '$lib/components/core/combobox/store';
  import type { ComboboxOptionComponent } from '$lib/components/core/combobox/utils';
  import ComboboxOption from '$lib/components/core/combobox/combobox-option.svelte';

  interface Props {
    options: TOptionValue[];
    optionAction: ComboboxStore<TOptionValue>['optionAction'];
    optionComponent?: ComboboxOptionComponent<TOptionValue> | undefined;
    header?: string;
    indexOffset?: number;
  }

  let {
    options,
    optionAction,
    optionComponent = undefined,
    header = '',
    indexOffset = 0,
  }: Props = $props();
</script>

{#if options.length > 0}
  {#if header}<div data-id="group-header" class="p-1 font-semibold">{header}</div>{/if}
  {#each options as option, index (option.value)}
    {@const SvelteComponent = optionComponent || ComboboxOption}
    <SvelteComponent
      {option}
      optionIndex={index + indexOffset}
      {optionAction}
    />
  {/each}
{/if}
