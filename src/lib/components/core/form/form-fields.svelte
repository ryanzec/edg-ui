<script lang="ts">
  type Props = { children?: import('svelte').Snippet };

  let { children }: Props = $props();
</script>

<div class="flex flex-col gap-1">{@render children?.()}</div>
