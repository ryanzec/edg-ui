<script lang="ts" module>
  export enum BadgeColor {
    BRAND = 'brand',
    NEUTRAL = 'neutral',
    SUCCESS = 'success',
    INFO = 'info',
    WARNING = 'warning',
    DANGER = 'danger',
  }

  export enum BadgeShape {
    ROUNDED = 'rounded',
    PILL = 'pill',
  }
</script>

<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  import { tailwindUtils } from '$lib/utils/tailwind';

  type Props = HTMLAttributes<HTMLDivElement> & {
    color?: BadgeColor;
    shape?: BadgeShape;
    children?: import('svelte').Snippet;
  };

  let { color = BadgeColor.NEUTRAL, shape = BadgeShape.ROUNDED, children, ...rest }: Props = $props();

  const colorCss: Record<BadgeColor, string> = {
    [BadgeColor.BRAND]: 'border-brand-bold bg-brand-subtle2 text-brand-bold',
    [BadgeColor.NEUTRAL]: 'border-neutral-bold bg-neutral-subtle2 text-neutral-bold',
    [BadgeColor.SUCCESS]: 'border-success-bold bg-success-subtle2 text-success-bold',
    [BadgeColor.INFO]: 'border-info-bold bg-info-subtle2 text-info-bold',
    [BadgeColor.WARNING]: 'border-warning-bold bg-warning-subtle2 text-warning-bold',
    [BadgeColor.DANGER]: 'border-danger-bold bg-danger-subtle2 text-danger-bold',
  };

  export const shapeCss: Record<BadgeShape, string> = {
    [BadgeShape.ROUNDED]: 'rounded-base',
    [BadgeShape.PILL]: 'rounded-full',
  };
</script>

<div
  class={tailwindUtils.merge('px-2xs py-3xs inline-block border text-xs', colorCss[color], shapeCss[shape])}
  {...rest}
>
  {@render children?.()}
</div>
