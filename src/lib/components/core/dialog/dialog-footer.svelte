<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<div data-id="footer" class="flex justify-end gap-2">
  {@render children?.()}
</div>
