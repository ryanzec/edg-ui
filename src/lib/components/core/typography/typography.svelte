<script lang="ts">
  interface Props {
    tag?: string;
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let { tag = 'div', children, ...rest }: Props = $props();
</script>

<svelte:element this={tag} data-id="typography" {...rest}>{@render children?.()}</svelte:element>
