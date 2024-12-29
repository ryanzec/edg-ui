<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type TooltipContentProps = HTMLAttributes<HTMLDivElement> & { children?: import('svelte').Snippet };
</script>

<script lang="ts">
  import { tailwindUtils } from '$lib/utils/tailwind';

  let { class: extraClass = '', children, ...rest }: TooltipContentProps = $props();
</script>

<div
  data-id="content"
  class={tailwindUtils.merge(
    'bg-on-surface text-surface-on-inverse px-xs py-2xs opacity-none absolute rounded-sm transition-opacity duration-[250ms]',
    extraClass,
  )}
  data-tooltip-content
  {...rest}
>
  {@render children?.()}
</div>
