<script module lang="ts">
  export enum CalloutVariant {
    FILLED = 'filled',
    WEAK = 'weak',
  }

  export enum CalloutColor {
    BRAND = 'brand',
    NEUTRAL = 'neutral',
    SUCCESS = 'success',
    INFO = 'info',
    WARNING = 'warning',
    DANGER = 'danger',
  }
</script>

<script lang="ts">
  import { iconComponents, type IconName } from '$lib/components/core/icons/utils';
  import { tailwindUtils } from '$lib/utils/tailwind';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLDivElement> & {
    variant?: CalloutVariant;
    color?: CalloutColor;
    preIcon?: IconName;
    postIcon?: IconName;
    label: string;
  };

  let { variant = CalloutVariant.FILLED, color = CalloutColor.NEUTRAL, preIcon, postIcon, label }: Props = $props();

  const colorCss: Record<CalloutVariant, Record<CalloutColor, string>> = {
    [CalloutVariant.WEAK]: {
      [CalloutColor.BRAND]: 'border-brand bg-brand-subtle text-brand-bold',
      [CalloutColor.NEUTRAL]: 'border-neutral bg-neutral-subtle text-neutral-bold',
      [CalloutColor.SUCCESS]: 'border-success bg-success-subtle text-success-bold',
      [CalloutColor.INFO]: 'border-info bg-info-subtle text-info-bold',
      [CalloutColor.WARNING]: 'border-warning bg-warning-subtle text-warning-bold',
      [CalloutColor.DANGER]: 'border-danger bg-danger-subtle text-danger-bold',
    },
    [CalloutVariant.FILLED]: {
      [CalloutColor.BRAND]: 'border-brand bg-brand text-on-brand',
      [CalloutColor.NEUTRAL]: 'border-neutral bg-neutral text-on-neutral',
      [CalloutColor.SUCCESS]: 'border-success bg-success text-on-success',
      [CalloutColor.INFO]: 'border-info bg-info text-on-info',
      [CalloutColor.WARNING]: 'border-warning bg-warning text-on-warning',
      [CalloutColor.DANGER]: 'border-danger bg-danger text-on-danger',
    },
  };
</script>

<div
  class={tailwindUtils.merge('gap-2xs px-sm py-xs flex items-center rounded-sm border', colorCss[variant][color], {
    ' border-l-[8px]': variant === CalloutVariant.WEAK,
  })}
>
  {#if preIcon}
    {@const IconComponent = iconComponents[preIcon]}
    <IconComponent />
  {/if}
  {label}
  {#if postIcon}
    {@const IconComponent = iconComponents[postIcon]}
    <IconComponent />
  {/if}
</div>
