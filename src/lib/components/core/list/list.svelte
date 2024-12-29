<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export enum ListShape {
    SQUARE = 'square',
    ROUNDED = 'rounded',
  }

  export type ListProps = HTMLAttributes<HTMLUListElement> & {
    children: import('svelte').Snippet;
    shape?: ListShape;
  };
</script>

<script lang="ts">
  import { tailwindUtils } from '$lib/utils/tailwind';

  let { children, shape = ListShape.SQUARE, class: extraClass = '', ...rest }: ListProps = $props();
</script>

<ul
  class={tailwindUtils.merge('border-outline flex flex-col border', extraClass, {
    'rounded-base': shape === ListShape.ROUNDED,
  })}
  {...rest}
>
  {@render children()}
</ul>
