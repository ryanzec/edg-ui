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

  export enum BadgeVariant {
    FILLED = 'filled',
    WEAK = 'weak',
  }
</script>

<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { iconComponents, type IconName } from '$lib/components/core/icons/utils';

  import { tailwindUtils } from '$lib/utils/tailwind';

  type Props = HTMLAttributes<HTMLDivElement> & {
    color?: BadgeColor;
    shape?: BadgeShape;
    variant?: BadgeVariant;
    children?: import('svelte').Snippet;
    preIcon?: IconName;
    postIcon?: IconName;
  };

  let {
    color = BadgeColor.NEUTRAL,
    shape = BadgeShape.ROUNDED,
    variant = BadgeVariant.WEAK,
    children,
    preIcon,
    postIcon,
    ...rest
  }: Props = $props();

  const colorCss: Record<BadgeVariant, Record<BadgeColor, string>> = {
    [BadgeVariant.WEAK]: {
      [BadgeColor.BRAND]: 'border-brand bg-brand-subtle text-brand-bold',
      [BadgeColor.NEUTRAL]: 'border-neutral bg-neutral-subtle text-neutral-bold',
      [BadgeColor.SUCCESS]: 'border-success bg-success-subtle text-success-bold',
      [BadgeColor.INFO]: 'border-info bg-info-subtle text-info-bold',
      [BadgeColor.WARNING]: 'border-warning bg-warning-subtle text-warning-bold',
      [BadgeColor.DANGER]: 'border-danger bg-danger-subtle text-danger-bold',
    },
    [BadgeVariant.FILLED]: {
      [BadgeColor.BRAND]: 'border-brand bg-brand text-on-brand',
      [BadgeColor.NEUTRAL]: 'border-neutral bg-neutral text-on-neutral',
      [BadgeColor.SUCCESS]: 'border-success bg-success text-on-success',
      [BadgeColor.INFO]: 'border-info bg-info text-on-info',
      [BadgeColor.WARNING]: 'border-warning bg-warning text-on-warning',
      [BadgeColor.DANGER]: 'border-danger bg-danger text-on-danger',
    },
  };

  export const shapeCss: Record<BadgeShape, string> = {
    [BadgeShape.ROUNDED]: 'rounded-base',
    [BadgeShape.PILL]: 'rounded-full',
  };
</script>

<div
  class={tailwindUtils.merge(
    'px-2xs py-3xs gap-2xs tracking-sm flex items-center border text-sm',
    shapeCss[shape],
    colorCss[variant][color],
    { 'px-xs': shape === BadgeShape.PILL },
  )}
  {...rest}
>
  {#if preIcon}
    {@const IconComponent = iconComponents[preIcon]}
    <IconComponent />
  {/if}
  {@render children?.()}
  {#if postIcon}
    {@const IconComponent = iconComponents[postIcon]}
    <IconComponent />
  {/if}
</div>
