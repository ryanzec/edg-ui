<script lang="ts">
  type Props = { children?: import('svelte').Snippet };

  let { children }: Props = $props();
</script>

<div data-id="footer" class="gap-xs border-outline p-base flex justify-end border-t">{@render children?.()}</div>
