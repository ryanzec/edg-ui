<script module lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export enum TableShape {
    SQUARE = 'square',
    ROUNDED = 'round',
  }

  export type TableHeaderProps = HTMLAttributes<HTMLTableElement> & {
    children: Snippet;
    tableHead?: Snippet;
    footer?: Snippet;
    shape?: TableShape;
    hasFixedHeader?: boolean;
  };
</script>

<script lang="ts">
  import { tailwindUtils } from '$lib/utils/tailwind';
  import ScrollArea from '../scroll-area/scroll-area.svelte';

  let {
    children,
    class: extraClass = '',
    tableHead,
    footer,
    shape = TableShape.ROUNDED,
    hasFixedHeader = false,
    ...rest
  }: TableHeaderProps = $props();
</script>

<div
  class={tailwindUtils.merge('table-container border-outline flex h-full w-full overflow-hidden border', {
    'rounded-sm': shape === TableShape.ROUNDED,
  })}
>
  <div class="max-h-full w-full">
    <ScrollArea class="h-full">
      <table class={tailwindUtils.merge('border-spacing-none w-full border-separate', extraClass)} {...rest}>
        {#if tableHead}
          <thead class={tailwindUtils.merge({ 'sticky top-[0]': hasFixedHeader })}>
            {@render tableHead()}
          </thead>
        {/if}
        <tbody>
          {@render children()}
        </tbody>
      </table>
      {#if footer}
        <div class={tailwindUtils.merge('footer p-xs', { 'rounded-b-sm': shape === TableShape.ROUNDED })}>
          {@render footer()}
        </div>
      {/if}
    </ScrollArea>
  </div>
</div>
