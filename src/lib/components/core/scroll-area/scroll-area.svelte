<script lang="ts">
  import { OverlayScrollbarsComponent } from 'overlayscrollbars-svelte';

  let extraClass: string = '';
  export { extraClass as class };
</script>

<OverlayScrollbarsComponent class={extraClass} defer>
  <slot />
</OverlayScrollbarsComponent>
