<script lang="ts">
  type Props = { children?: import('svelte').Snippet };

  let { children }: Props = $props();
</script>

<div data-id="label" class="px-xs leading-lg tracking-xs text-xs">{@render children?.()}</div>
