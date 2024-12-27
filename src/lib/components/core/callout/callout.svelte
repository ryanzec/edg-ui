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
  import { tailwindUtils } from '$lib/utils/tailwind';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type Props = HTMLAttributes<HTMLDivElement> & {
    variant?: CalloutVariant;
    color?: CalloutColor;
    preItem?: Snippet;
    postItem?: Snippet;
    children: Snippet;
  };

  let {
    variant = CalloutVariant.WEAK,
    color = CalloutColor.NEUTRAL,
    preItem,
    postItem,
    class: extraClass = '',
    children,
  }: Props = $props();

  const colorCss: Record<CalloutVariant, Record<CalloutColor, string>> = {
    [CalloutVariant.WEAK]: {
      [CalloutColor.BRAND]: 'border-brand bg-brand-subtle text-brand-bold fill-brand',
      [CalloutColor.NEUTRAL]: 'border-neutral bg-neutral-subtle text-neutral-bold fill-neutral',
      [CalloutColor.SUCCESS]: 'border-success bg-success-subtle text-success-bold fill-success',
      [CalloutColor.INFO]: 'border-info bg-info-subtle text-info-bold fill-info',
      [CalloutColor.WARNING]: 'border-warning bg-warning-subtle text-warning-bold fill-warning',
      [CalloutColor.DANGER]: 'border-danger bg-danger-subtle text-danger-bold fill-danger',
    },
    [CalloutVariant.FILLED]: {
      [CalloutColor.BRAND]: 'border-brand bg-brand text-on-brand fill-on-brand',
      [CalloutColor.NEUTRAL]: 'border-neutral bg-neutral text-on-neutral fill-on-neutral',
      [CalloutColor.SUCCESS]: 'border-success bg-success text-on-success fill-on-success',
      [CalloutColor.INFO]: 'border-info bg-info text-on-info fill-on-info',
      [CalloutColor.WARNING]: 'border-warning bg-warning text-on-warning fill-on-warning',
      [CalloutColor.DANGER]: 'border-danger bg-danger text-on-danger fill-on-danger',
    },
  };
</script>

<div
  class={tailwindUtils.merge(
    'gap-2xs px-sm py-xs flex items-center rounded-sm border',
    extraClass,
    colorCss[variant][color],
    { ' border-l-[8px]': variant === CalloutVariant.WEAK },
  )}
>
  {@render preItem?.()}
  {@render children()}
  {@render postItem?.()}
</div>
