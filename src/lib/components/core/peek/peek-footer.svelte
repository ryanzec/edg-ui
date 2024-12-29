<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type PeekFooterProps = HTMLAttributes<HTMLDivElement> & { children?: import('svelte').Snippet };
</script>

<script lang="ts">
  import { tailwindUtils } from '$lib/utils/tailwind';

  let { children, class: extraClass = '', ...rest }: PeekFooterProps = $props();
</script>

<div
  data-id="footer"
  class={tailwindUtils.merge('gap-xs border-outline p-base flex justify-end border-t', extraClass)}
  {...rest}
>
  {@render children?.()}
</div>
