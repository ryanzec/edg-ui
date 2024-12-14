<script lang="ts">
  type Props = { children?: import('svelte').Snippet };

  let { children }: Props = $props();
</script>

<div data-id="label" class="px-2 text-xs leading-6">{@render children?.()}</div>
