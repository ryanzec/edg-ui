<script lang="ts">
  type Props = { children?: import('svelte').Snippet };

  let { children }: Props = $props();
</script>

<fieldset>{@render children?.()}</fieldset>
