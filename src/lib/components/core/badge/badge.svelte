<script lang="ts" context="module">
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
  import { twMerge } from 'tailwind-merge';

  export let color: BadgeColor = BadgeColor.NEUTRAL;
  export let shape: BadgeShape = BadgeShape.ROUNDED;

  const colorCss: Record<BadgeColor, string> = {
    [BadgeColor.BRAND]: 'border-brand-bold bg-brand-subtle text-brand-bold',
    [BadgeColor.NEUTRAL]: 'border-neutral-bold bg-neutral-subtle text-neutral-bold',
    [BadgeColor.SUCCESS]: 'border-success-bold bg-success-subtle text-success-bold',
    [BadgeColor.INFO]: 'border-info-bold bg-info-subtle text-info-bold',
    [BadgeColor.WARNING]: 'border-warning-bold bg-warning-subtle text-warning-bold',
    [BadgeColor.DANGER]: 'border-danger-bold bg-danger-subtle text-danger-bold',
  };

  export const shapeCss: Record<BadgeShape, string> = {
    [BadgeShape.ROUNDED]: 'rounded-lg',
    [BadgeShape.PILL]: 'rounded-full',
  };
</script>

<div class={twMerge('inline-block border px-1 py-0.5 text-xs', colorCss[color], shapeCss[shape])} {...$$restProps}>
  <slot />
</div>
