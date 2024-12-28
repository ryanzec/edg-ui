<script module lang="ts">
  export enum ButtonVariant {
    FILLED = 'filled',
    WEAK = 'weak',
    OUTLINED = 'outlined',
    GHOST = 'ghost',
  }
  export enum ButtonColor {
    BRAND = 'brand',
    NEUTRAL = 'neutral',
    SUCCESS = 'success',
    INFO = 'info',
    WARNING = 'warning',
    DANGER = 'danger',
  }
  export enum ButtonShape {
    ROUNDED = 'rounded',
    PILL = 'pill',
    CIRCLE = 'circle',
  }

  export const BUTTON_CONTEXT_KEY = 'button';

  export type ButtonContext = {
    variant?: ButtonVariant;
    color?: ButtonColor;
    shape?: ButtonShape;
  };

  export const getButtonContext = (): ButtonContext => {
    return getContext<ButtonContext>(BUTTON_CONTEXT_KEY);
  };

  export type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
    isLoading?: boolean;
    variant?: ButtonVariant;
    color?: ButtonColor;
    shape?: ButtonShape;

    // since action can really be anything, we are going to ignore eslint issue for these
    action?: Function;
    actionOptions?: any;

    class?: string;
    preItem?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
    postItem?: import('svelte').Snippet;
    isActive?: boolean;

    // these should be standard but apparent not
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  };
</script>

<script lang="ts">
  import LoaderIcon from '$lib/components/core/loader/loader-icon.svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { tailwindUtils } from '$lib/utils/tailwind';
  import { getContext } from 'svelte';

  const buttonContext = getButtonContext();

  let {
    isLoading = false,
    variant = buttonContext?.variant || ButtonVariant.FILLED,
    color = buttonContext?.color || ButtonColor.BRAND,
    shape = buttonContext?.shape || ButtonShape.ROUNDED,
    action = () => {},
    actionOptions = undefined,
    class: extraClass = '',
    preItem,
    postItem,
    isActive = false,
    children,
    ...rest
  }: ButtonProps = $props();

  let isDisabled = $derived(isLoading || !!rest.disabled);

  const filledColorsCss = {
    [ButtonColor.BRAND]:
      'text-on-brand fill-on-brand bg-brand [&:not([disabled])]:hover:bg-brand2 [&:not([disabled])]:active:bg-brand3 border-brand [&:not([disabled])]:hover:border-brand2 [&:not([disabled])]:active:border-brand3',
    [ButtonColor.NEUTRAL]:
      'text-on-neutral fill-on-neutral bg-neutral [&:not([disabled])]:hover:bg-neutral2 [&:not([disabled])]:active:bg-neutral3 border-neutral [&:not([disabled])]:hover:border-neutral2 [&:not([disabled])]:active:border-neutral3',
    [ButtonColor.SUCCESS]:
      'text-on-success fill-on-success bg-success [&:not([disabled])]:hover:bg-success2 [&:not([disabled])]:active:bg-success3 border-success [&:not([disabled])]:hover:border-success2 [&:not([disabled])]:active:border-success3',
    [ButtonColor.INFO]:
      'text-on-info fill-on-info bg-info [&:not([disabled])]:hover:bg-info2 [&:not([disabled])]:active:bg-info3 border-info [&:not([disabled])]:hover:border-info2 [&:not([disabled])]:active:border-info3',
    [ButtonColor.WARNING]:
      'text-on-warning fill-on-warning bg-warning [&:not([disabled])]:hover:bg-warning2 [&:not([disabled])]:active:bg-warning3 border-warning [&:not([disabled])]:hover:border-warning2 [&:not([disabled])]:active:border-warning3',
    [ButtonColor.DANGER]:
      'text-on-danger fill-on-danger bg-danger [&:not([disabled])]:hover:bg-danger2 [&:not([disabled])]:active:bg-danger3 border-danger [&:not([disabled])]:hover:border-danger2 [&:not([disabled])]:active:border-danger3',
  };
  const weakColorsCss: Record<ButtonColor, string> = {
    [ButtonColor.BRAND]:
      'text-brand-bold fill-brand-bold bg-brand-subtle [&:not([disabled])]:hover:bg-brand-subtle2 [&:not([disabled])]:active:bg-brand-subtle3 border-brand-subtle [&:not([disabled])]:hover:border-brand-subtle2 [&:not([disabled])]:active:border-brand-subtle3',
    [ButtonColor.NEUTRAL]:
      'text-neutral-bold fill-neutral-bold bg-neutral-subtle [&:not([disabled])]:hover:bg-neutral-subtle2 [&:not([disabled])]:active:bg-neutral-subtle3 border-neutral-subtle [&:not([disabled])]:hover:border-neutral-subtle2 [&:not([disabled])]:active:border-neutral-subtle3',
    [ButtonColor.SUCCESS]:
      'text-success-bold fill-success-bold bg-success-subtle [&:not([disabled])]:hover:bg-success-subtle2 [&:not([disabled])]:active:bg-success-subtle3 border-success-subtle [&:not([disabled])]:hover:border-success-subtle2 [&:not([disabled])]:active:border-success-subtle3',
    [ButtonColor.INFO]:
      'text-info-bold fill-info-bold bg-info-subtle [&:not([disabled])]:hover:bg-info-subtle2 [&:not([disabled])]:active:bg-info-subtle3 border-info-subtle [&:not([disabled])]:hover:border-info-subtle2 [&:not([disabled])]:active:border-info-subtle3',
    [ButtonColor.WARNING]:
      'text-warning-bold fill-warning-bold bg-warning-subtle [&:not([disabled])]:hover:bg-warning-subtle2 [&:not([disabled])]:active:bg-warning-subtle3 border-warning-subtle [&:not([disabled])]:hover:border-warning-subtle2 [&:not([disabled])]:active:border-warning-subtle3',
    [ButtonColor.DANGER]:
      'text-danger-bold fill-danger-bold bg-danger-subtle [&:not([disabled])]:hover:bg-danger-subtle2 [&:not([disabled])]:active:bg-danger-subtle3 border-danger-subtle [&:not([disabled])]:hover:border-danger-subtle2 [&:not([disabled])]:active:border-danger-subtle3',
  };
  const outlinedColorsCss: Record<ButtonColor, string> = {
    [ButtonColor.BRAND]:
      'text-brand-bold fill-brand-bold [&:not([disabled])]:hover:bg-brand-subtle2 [&:not([disabled])]:active:bg-brand-subtle3 border-brand',
    [ButtonColor.NEUTRAL]:
      'text-neutral-bold fill-neutral-bold [&:not([disabled])]:hover:bg-neutral-subtle2 [&:not([disabled])]:active:bg-neutral-subtle3 border-neutral',
    [ButtonColor.SUCCESS]:
      'text-success-bold fill-success-bold [&:not([disabled])]:hover:bg-success-subtle2 [&:not([disabled])]:active:bg-success-subtle3 border-success',
    [ButtonColor.INFO]:
      'text-info-bold fill-info-bold [&:not([disabled])]:hover:bg-info-subtle2 [&:not([disabled])]:active:bg-info-subtle3 border-info',
    [ButtonColor.WARNING]:
      'text-warning-bold fill-warning-bold [&:not([disabled])]:hover:bg-warning-subtle2 [&:not([disabled])]:active:bg-warning-subtle3 border-warning',
    [ButtonColor.DANGER]:
      'text-danger-bold fill-danger-bold [&:not([disabled])]:hover:bg-danger-subtle2 [&:not([disabled])]:active:bg-danger-subtle3 border-danger',
  };
  const ghostColorsCss: Record<ButtonColor, string> = {
    [ButtonColor.BRAND]:
      'text-brand-bold fill-brand-bold [&:not([disabled])]:hover:bg-brand-subtle2 [&:not([disabled])]:active:bg-brand-subtle3',
    [ButtonColor.NEUTRAL]:
      'text-neutral-bold fill-neutral-bold [&:not([disabled])]:hover:bg-neutral-subtle2 [&:not([disabled])]:active:bg-neutral-subtle3',
    [ButtonColor.SUCCESS]:
      'text-success-bold fill-success-bold [&:not([disabled])]:hover:bg-success-subtle2 [&:not([disabled])]:active:bg-success-subtle3',
    [ButtonColor.INFO]:
      'text-info-bold fill-info-bold [&:not([disabled])]:hover:bg-info-subtle2 [&:not([disabled])]:active:bg-info-subtle3',
    [ButtonColor.WARNING]:
      'text-warning-bold fill-warning-bold [&:not([disabled])]:hover:bg-warning-subtle2 [&:not([disabled])]:active:bg-warning-subtle3',
    [ButtonColor.DANGER]:
      'text-danger-bold fill-danger-bold [&:not([disabled])]:hover:bg-danger-subtle2 [&:not([disabled])]:active:bg-danger-subtle3',
  };
  const activeColorsCss: Record<ButtonColor, string> = {
    [ButtonColor.BRAND]: '[&:not([disabled])]:bg-brand-subtle3',
    [ButtonColor.NEUTRAL]: '[&:not([disabled])]:bg-neutral-subtle3',
    [ButtonColor.SUCCESS]: '[&:not([disabled])]:bg-success-subtle3',
    [ButtonColor.INFO]: '[&:not([disabled])]:bg-info-subtle3',
    [ButtonColor.WARNING]: '[&:not([disabled])]:bg-warning-subtle3',
    [ButtonColor.DANGER]: '[&:not([disabled])]:bg-danger-subtle3',
  };
  const colorsCss: Record<ButtonVariant, Record<ButtonColor, string>> = {
    [ButtonVariant.FILLED]: filledColorsCss,
    [ButtonVariant.WEAK]: weakColorsCss,
    [ButtonVariant.OUTLINED]: outlinedColorsCss,
    [ButtonVariant.GHOST]: ghostColorsCss,
  };
</script>

<button
  use:action={actionOptions}
  data-id="button"
  type="button"
  {...rest}
  disabled={isDisabled}
  class={tailwindUtils.merge(
    'gap-xs flex cursor-pointer items-center justify-center border border-transparent',
    colorsCss[variant][color],
    isActive && variant === ButtonVariant.OUTLINED && activeColorsCss[color],
    extraClass,
    {
      'opacity-disabled': isDisabled,
      'cursor-not-allowed': isDisabled,
      'rounded-base': shape === ButtonShape.ROUNDED,
      'rounded-full': shape === ButtonShape.PILL || shape === ButtonShape.CIRCLE,
      'px-sm': shape !== ButtonShape.CIRCLE,
      'py-2xs': shape !== ButtonShape.CIRCLE,
      // dislike pixel perfect setting like this but do not see any other way
      'w-[30px]': shape === ButtonShape.CIRCLE,
      'h-[30px]': shape === ButtonShape.CIRCLE,
      active: isActive,
    },
  )}
>
  {#if !isLoading}{@render preItem?.()}{/if}
  {#if isLoading}<LoaderIcon />{/if}{@render children?.()}
  {#if !isLoading}{@render postItem?.()}{/if}
</button>
