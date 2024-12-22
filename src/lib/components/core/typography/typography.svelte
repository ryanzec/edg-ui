<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Props<TElementType extends keyof HTMLElementTagNameMap = 'div'> = HTMLAttributes<
    HTMLElementTagNameMap[TElementType]
  > & {
    tag?: TElementType;
    children?: import('svelte').Snippet;
  };

  let { tag = 'div', children, ...rest }: Props = $props();
</script>

<svelte:element this={tag} data-id="typography" {...rest}>{@render children?.()}</svelte:element>
