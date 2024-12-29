<script module lang="ts">
  import type { PartialOptions } from 'overlayscrollbars';

  export type ScrollAreaProps = {
    options?: PartialOptions;
    class?: string;
    children?: import('svelte').Snippet;
  };
</script>

<script lang="ts">
  import { OverlayScrollbarsComponent } from 'overlayscrollbars-svelte';

  let { options = {}, class: extraClass = '', children }: ScrollAreaProps = $props();

  const defaultOptions: PartialOptions = { scrollbars: { autoHideDelay: 100 } };
</script>

<OverlayScrollbarsComponent
  class={extraClass}
  options={structuredClone({
    ...defaultOptions,
    ...options,
  })}
  defer
>
  {@render children?.()}
</OverlayScrollbarsComponent>
