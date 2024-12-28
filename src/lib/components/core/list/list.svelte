<script module lang="ts">
  export enum ListShape {
    SQUARE = 'square',
    ROUNDED = 'rounded',
  }
</script>

<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { tailwindUtils } from '$lib/utils/tailwind';

  type Props = HTMLAttributes<HTMLUListElement> & {
    children: import('svelte').Snippet;
    shape?: ListShape;
  };

  let { children, shape = ListShape.SQUARE, class: extraClass = '', ...rest }: Props = $props();
</script>

<ul
  class={tailwindUtils.merge('border-outline flex flex-col border', extraClass, {
    'rounded-base': shape === ListShape.ROUNDED,
  })}
  {...rest}
>
  {@render children()}
</ul>
