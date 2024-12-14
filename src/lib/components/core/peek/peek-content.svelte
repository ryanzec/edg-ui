<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<div data-id="content" class="flex-1">{@render children?.()}</div>
