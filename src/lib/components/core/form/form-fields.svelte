<script lang="ts">
  type Props = { children?: import('svelte').Snippet };

  let { children }: Props = $props();
</script>

<div class="gap-2xs flex flex-col">{@render children?.()}</div>
