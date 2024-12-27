<script lang="ts">
  type Props = { children?: import('svelte').Snippet };

  let { children }: Props = $props();
</script>

<div data-id="content" class="p-base flex-1">{@render children?.()}</div>
