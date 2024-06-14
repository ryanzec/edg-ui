<script lang="ts" generics="TOptionValue extends { display: string; value: string; }">
  /* global TOptionValue */
  import type { ComboboxStore } from '$lib/components/core/combobox/store';
  import type { ComboboxOptionComponent } from '$lib/components/core/combobox/utils';
  import ComboboxOption from '$lib/components/core/combobox/combobox-option.svelte';

  export let options: TOptionValue[];
  export let optionAction: ComboboxStore<TOptionValue>['optionAction'];
  export let optionComponent: ComboboxOptionComponent<TOptionValue> | undefined = undefined;
  export let header: string = '';
  export let indexOffset: number = 0;
</script>

{#if options.length > 0}
  {#if header}<div data-id="group-header" class="p-1 font-semibold">{header}</div>{/if}
  {#each options as option, index (option.value)}
    <svelte:component
      this={optionComponent || ComboboxOption}
      {option}
      optionIndex={index + indexOffset}
      {optionAction}
    />
  {/each}
{/if}
