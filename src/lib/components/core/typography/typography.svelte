<script module lang="ts">
  export enum TypographyColor {
    DEFAULT = 'default',
    BRAND = 'brand',
    NEUTRAL = 'neutral',
    SUCCESS = 'success',
    INFO = 'info',
    WARNING = 'warning',
    DANGER = 'danger',
  }
</script>

<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { tailwindUtils } from '$lib/utils/tailwind';

  type Props<TElementType extends keyof HTMLElementTagNameMap = 'div'> = HTMLAttributes<
    HTMLElementTagNameMap[TElementType]
  > & {
    tag?: TElementType;
    children?: import('svelte').Snippet;
    color?: TypographyColor;
  };

  let { tag = 'div', children, color = TypographyColor.DEFAULT, class: extraClass = '', ...rest }: Props = $props();
</script>

<svelte:element
  this={tag}
  data-id="typography"
  class={tailwindUtils.merge(extraClass, {
    'text-brand': color === TypographyColor.BRAND,
    'text-neutral': color === TypographyColor.NEUTRAL,
    'text-success': color === TypographyColor.SUCCESS,
    'text-info': color === TypographyColor.INFO,
    'text-warning': color === TypographyColor.WARNING,
    'text-danger': color === TypographyColor.DANGER,
  })}
  {...rest}
>
  {@render children?.()}
</svelte:element>
