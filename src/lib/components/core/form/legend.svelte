<script lang="ts">
  type Props = { children?: import('svelte').Snippet };

  let { children }: Props = $props();
</script>

<legend>{@render children?.()}</legend>
