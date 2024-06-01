<script lang="ts">
  import type { PartialOptions } from 'overlayscrollbars';
  import { OverlayScrollbarsComponent } from 'overlayscrollbars-svelte';

  export let options: PartialOptions = {};

  let extraClass: string = '';
  export { extraClass as class };

  const defaultOptions: PartialOptions = {
    scrollbars: {
      autoHideDelay: 100,
    },
  };
</script>

<OverlayScrollbarsComponent class={extraClass} options={structuredClone({ ...defaultOptions, ...options })} defer>
  <slot />
</OverlayScrollbarsComponent>
