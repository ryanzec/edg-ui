<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLDivElement> & { children?: import('svelte').Snippet };

  let { children, ...rest }: Props = $props();
</script>

<div data-id="label" class="px-xs leading-lg tracking-xs text-xs" {...rest}>{@render children?.()}</div>
