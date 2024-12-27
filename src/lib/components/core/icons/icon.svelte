<script module lang="ts">
  export enum IconSize {
    EXTRA_SMALL = 'extra-small',
    SMALL = 'small',
    BASE = 'base',
    LARGE = 'large',
    EXTRA_LARGE = 'extra-large',
    EXTRA_LARGE2 = 'extra-large2',
    EXTRA_LARGE3 = 'extra-large3',
    EXTRA_LARGE4 = 'extra-large4',
    FULL = 'full',
  }

  export enum IconColor {
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
  import { iconComponents, type IconName } from '$lib/components/core/icons/utils';
  import type { HTMLAttributes } from 'svelte/elements';
  import { tailwindUtils } from '$lib/utils/tailwind';

  type Props = HTMLAttributes<HTMLDivElement> & {
    icon: IconName;
    size?: IconSize;
    color?: IconColor;
  };

  let { icon, size = IconSize.BASE, class: extraClass = '', color = IconColor.DEFAULT, ...rest }: Props = $props();
</script>

{#if icon}
  <div
    class={tailwindUtils.merge(extraClass, {
      'h-xs w-xs': IconSize.EXTRA_SMALL === size,
      'h-sm w-sm': IconSize.SMALL === size,
      'w-base h-base': IconSize.BASE === size,
      'h-lg w-lg': IconSize.LARGE === size,
      'h-xl w-xl': IconSize.EXTRA_LARGE === size,
      'h-2xl w-2xl': IconSize.EXTRA_LARGE2 === size,
      'h-3xl w-3xl': IconSize.EXTRA_LARGE3 === size,
      'h-4xl w-4xl': IconSize.EXTRA_LARGE4 === size,
      'h-full w-full': IconSize.FULL === size,
      'fill-brand': IconColor.BRAND === color,
      'fill-neutral': IconColor.NEUTRAL === color,
      'fill-success': IconColor.SUCCESS === color,
      'fill-info': IconColor.INFO === color,
      'fill-warning': IconColor.WARNING === color,
      'fill-danger': IconColor.DANGER === color,
    })}
    {...rest}
  >
    {@html iconComponents[icon]}
  </div>
{/if}
