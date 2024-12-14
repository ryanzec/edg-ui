<script lang="ts">
  import type { PartialOptions } from 'overlayscrollbars';
  import { OverlayScrollbarsComponent } from 'overlayscrollbars-svelte';


  interface Props {
    options?: PartialOptions;
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { options = {}, class: extraClass = '', children }: Props = $props();


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
