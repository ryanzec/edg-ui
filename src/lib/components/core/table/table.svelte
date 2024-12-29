<script module lang="ts">
  import { tailwindUtils } from '$lib/utils/tailwind';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export type TableHeaderProps = HTMLAttributes<HTMLTableElement> & {
    children: Snippet;
    tableHead?: Snippet;
    footer?: Snippet;
  };
</script>

<script lang="ts">
  let { children, class: extraClass = '', tableHead, footer, ...rest }: TableHeaderProps = $props();
</script>

<div class="table-container bg-surface-pure border-outline w-full rounded-sm border">
  <table class={tailwindUtils.merge('w-full', extraClass)} {...rest}>
    {#if tableHead}
      <thead>
        {@render tableHead()}
      </thead>
    {/if}
    <tbody>
      {@render children()}
    </tbody>
  </table>
  {#if footer}
    <div class="footer p-xs border-outline border-t">
      {@render footer()}
    </div>
  {/if}
</div>
