<script lang="ts">
  type Props = { children?: import('svelte').Snippet };

  let { children }: Props = $props();
</script>

<div data-id="footer" class="gap-xs flex justify-end">
  {@render children?.()}
</div>
