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

  export enum BadgeStrength {
    STRONG = 'strong',
    WEAK = 'weak',
  }
</script>

<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  import { tailwindUtils } from '$lib/utils/tailwind';

  type Props = HTMLAttributes<HTMLDivElement> & {
    color?: BadgeColor;
    shape?: BadgeShape;
    strength?: BadgeStrength;
    children?: import('svelte').Snippet;
  };

  let {
    color = BadgeColor.NEUTRAL,
    shape = BadgeShape.ROUNDED,
    strength = BadgeStrength.WEAK,
    children,
    ...rest
  }: Props = $props();

  const weakColorCss: Record<BadgeColor, string> = {
    [BadgeColor.BRAND]: 'border-brand bg-brand-subtle text-brand-bold',
    [BadgeColor.NEUTRAL]: 'border-neutral bg-neutral-subtle text-neutral-bold',
    [BadgeColor.SUCCESS]: 'border-success bg-success-subtle text-success-bold',
    [BadgeColor.INFO]: 'border-info bg-info-subtle text-info-bold',
    [BadgeColor.WARNING]: 'border-warning bg-warning-subtle text-warning-bold',
    [BadgeColor.DANGER]: 'border-danger bg-danger-subtle text-danger-bold',
  };

  const strongColorCss: Record<BadgeColor, string> = {
    [BadgeColor.BRAND]: 'border-brand bg-brand text-on-brand',
    [BadgeColor.NEUTRAL]: 'border-neutral bg-neutral text-on-neutral',
    [BadgeColor.SUCCESS]: 'border-success bg-success text-on-success',
    [BadgeColor.INFO]: 'border-info bg-info text-on-info',
    [BadgeColor.WARNING]: 'border-warning bg-warning text-on-warning',
    [BadgeColor.DANGER]: 'border-danger bg-danger text-on-danger',
  };

  export const shapeCss: Record<BadgeShape, string> = {
    [BadgeShape.ROUNDED]: 'rounded-base',
    [BadgeShape.PILL]: 'rounded-full',
  };
</script>

<div
  class={tailwindUtils.merge('px-2xs py-3xs inline-block border text-xs', shapeCss[shape], {
    [weakColorCss[color]]: strength === BadgeStrength.WEAK,
    [strongColorCss[color]]: strength === BadgeStrength.STRONG,
  })}
  {...rest}
>
  {@render children?.()}
</div>
