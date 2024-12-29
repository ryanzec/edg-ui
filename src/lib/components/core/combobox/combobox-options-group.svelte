<script module lang="ts">
  import type { ComboboxStore } from '$lib/components/core/combobox/store';
  import type { ComboboxOptionComponent } from '$lib/components/core/combobox/utils';

  export type ComboboxOptionsGroupProps<
    TOptionValue extends {
      display: string;
      value: string;
    },
  > = {
    options: TOptionValue[];
    optionAction: ComboboxStore<TOptionValue>['optionAction'];
    optionComponent?: ComboboxOptionComponent<TOptionValue> | undefined;
    header?: string;
    indexOffset?: number;
  };
</script>

<script lang="ts" generics="TOptionValue extends { display: string; value: string; }">
  /* global TOptionValue */
  import ComboboxOption from '$lib/components/core/combobox/combobox-option.svelte';

  let {
    options,
    optionAction,
    optionComponent = undefined,
    header = '',
    indexOffset = 0,
  }: ComboboxOptionsGroupProps<TOptionValue> = $props();
</script>

{#if options.length > 0}
  {#if header}<div data-id="group-header" class="p-2xs font-semibold">{header}</div>{/if}
  {#each options as option, index (option.value)}
    {@const SvelteComponent = optionComponent || ComboboxOption}
    <SvelteComponent {option} optionIndex={index + indexOffset} {optionAction} />
  {/each}
{/if}
