<script context="module" lang="ts">
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
</script>

<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import LoaderIcon from '$lib/components/core/icons/loader-icon.svelte';

  export let isLoading: boolean = false;
  export let variant: ButtonVariant = ButtonVariant.FILLED;
  export let color: ButtonColor = ButtonColor.BRAND;
  export let shape: ButtonShape = ButtonShape.ROUNDED;

  let extraClass: string = '';
  export { extraClass as class };

  $: isDisabled = isLoading || $$restProps.disabled;

  const filledColorsCss = {
    [ButtonColor.BRAND]:
      'text-on-brand bg-brand [&:not([disabled])]:hover:bg-brand2 [&:not([disabled])]:active:bg-brand3 border-brand [&:not([disabled])]:hover:border-brand2 [&:not([disabled])]:active:border-brand3',
    [ButtonColor.NEUTRAL]:
      'text-on-neutral bg-neutral [&:not([disabled])]:hover:bg-neutral2 [&:not([disabled])]:active:bg-neutral3 border-neutral [&:not([disabled])]:hover:border-neutral2 [&:not([disabled])]:active:border-neutral3',
    [ButtonColor.SUCCESS]:
      'text-on-success bg-success [&:not([disabled])]:hover:bg-success2 [&:not([disabled])]:active:bg-success3 border-success [&:not([disabled])]:hover:border-success2 [&:not([disabled])]:active:border-success3',
    [ButtonColor.INFO]:
      'text-on-info bg-info [&:not([disabled])]:hover:bg-info2 [&:not([disabled])]:active:bg-info3 border-info [&:not([disabled])]:hover:border-info2 [&:not([disabled])]:active:border-info3',
    [ButtonColor.WARNING]:
      'text-on-warning bg-warning [&:not([disabled])]:hover:bg-warning2 [&:not([disabled])]:active:bg-warning3 border-warning [&:not([disabled])]:hover:border-warning2 [&:not([disabled])]:active:border-warning3',
    [ButtonColor.DANGER]:
      'text-on-danger bg-danger [&:not([disabled])]:hover:bg-danger2 [&:not([disabled])]:active:bg-danger3 border-danger [&:not([disabled])]:hover:border-danger2 [&:not([disabled])]:active:border-danger3',
  };
  const weakColorsCss: Record<ButtonColor, string> = {
    [ButtonColor.BRAND]:
      'text-brand-bold bg-brand-subtle [&:not([disabled])]:hover:bg-brand-subtle2 [&:not([disabled])]:active:bg-brand-subtle3 border-brand-subtle [&:not([disabled])]:hover:border-brand-subtle2 [&:not([disabled])]:active:border-brand-subtle3',
    [ButtonColor.NEUTRAL]:
      'text-neutral-bold bg-neutral-subtle [&:not([disabled])]:hover:bg-neutral-subtle2 [&:not([disabled])]:active:bg-neutral-subtle3 border-neutral-subtle [&:not([disabled])]:hover:border-neutral-subtle2 [&:not([disabled])]:active:border-neutral-subtle3',
    [ButtonColor.SUCCESS]:
      'text-success-bold bg-success-subtle [&:not([disabled])]:hover:bg-success-subtle2 [&:not([disabled])]:active:bg-success-subtle3 border-success-subtle [&:not([disabled])]:hover:border-success-subtle2 [&:not([disabled])]:active:border-success-subtle3',
    [ButtonColor.INFO]:
      'text-info-bold bg-info-subtle [&:not([disabled])]:hover:bg-info-subtle2 [&:not([disabled])]:active:bg-info-subtle3 border-info-subtle [&:not([disabled])]:hover:border-info-subtle2 [&:not([disabled])]:active:border-info-subtle3',
    [ButtonColor.WARNING]:
      'text-warning-bold bg-warning-subtle [&:not([disabled])]:hover:bg-warning-subtle2 [&:not([disabled])]:active:bg-warning-subtle3 border-warning-subtle [&:not([disabled])]:hover:border-warning-subtle2 [&:not([disabled])]:active:border-warning-subtle3',
    [ButtonColor.DANGER]:
      'text-danger-bold bg-danger-subtle [&:not([disabled])]:hover:bg-danger-subtle2 [&:not([disabled])]:active:bg-danger-subtle3 border-danger-subtle [&:not([disabled])]:hover:border-danger-subtle2 [&:not([disabled])]:active:border-danger-subtle3',
  };
  const outlinedColorsCss: Record<ButtonColor, string> = {
    [ButtonColor.BRAND]:
      'text-brand-bold [&:not([disabled])]:hover:bg-brand-subtle2 [&:not([disabled])]:active:bg-brand-subtle3 border-brand',
    [ButtonColor.NEUTRAL]:
      'text-neutral-bold [&:not([disabled])]:hover:bg-neutral-subtle2 [&:not([disabled])]:active:bg-neutral-subtle3 border-neutral',
    [ButtonColor.SUCCESS]:
      'text-success-bold [&:not([disabled])]:hover:bg-success-subtle2 [&:not([disabled])]:active:bg-success-subtle3 border-success',
    [ButtonColor.INFO]:
      'text-info-bold [&:not([disabled])]:hover:bg-info-subtle2 [&:not([disabled])]:active:bg-info-subtle3 border-info',
    [ButtonColor.WARNING]:
      'text-warning-bold [&:not([disabled])]:hover:bg-warning-subtle2 [&:not([disabled])]:active:bg-warning-subtle3 border-warning',
    [ButtonColor.DANGER]:
      'text-danger-bold [&:not([disabled])]:hover:bg-danger-subtle2 [&:not([disabled])]:active:bg-danger-subtle3 border-danger',
  };
  const ghostColorsCss: Record<ButtonColor, string> = {
    [ButtonColor.BRAND]:
      'text-brand-bold [&:not([disabled])]:hover:bg-brand-subtle2 [&:not([disabled])]:active:bg-brand-subtle3',
    [ButtonColor.NEUTRAL]:
      'text-neutral-bold [&:not([disabled])]:hover:bg-neutral-subtle2 [&:not([disabled])]:active:bg-neutral-subtle3',
    [ButtonColor.SUCCESS]:
      'text-success-bold [&:not([disabled])]:hover:bg-success-subtle2 [&:not([disabled])]:active:bg-success-subtle3',
    [ButtonColor.INFO]:
      'text-info-bold [&:not([disabled])]:hover:bg-info-subtle2 [&:not([disabled])]:active:bg-info-subtle3',
    [ButtonColor.WARNING]:
      'text-warning-bold [&:not([disabled])]:hover:bg-warning-subtle2 [&:not([disabled])]:active:bg-warning-subtle3',
    [ButtonColor.DANGER]:
      'text-danger-bold [&:not([disabled])]:hover:bg-danger-subtle2 [&:not([disabled])]:active:bg-danger-subtle3',
  };
  const colorsCss: Record<ButtonVariant, Record<ButtonColor, string>> = {
    [ButtonVariant.FILLED]: filledColorsCss,
    [ButtonVariant.WEAK]: weakColorsCss,
    [ButtonVariant.OUTLINED]: outlinedColorsCss,
    [ButtonVariant.GHOST]: ghostColorsCss,
  };
</script>

<button
  data-id="button"
  type="button"
  {...$$restProps}
  disabled={isDisabled}
  on:click
  class={twMerge('flex gap-2 border border-transparent', colorsCss[variant][color], extraClass)}
  class:opacity-45={isDisabled}
  class:rounded-lg={shape === ButtonShape.ROUNDED}
  class:rounded-full={shape === ButtonShape.PILL || shape === ButtonShape.CIRCLE}
  class:px-2.5={shape !== ButtonShape.CIRCLE}
  class:py-0.5={shape !== ButtonShape.CIRCLE}
  class:px-1={shape === ButtonShape.CIRCLE}
  class:py-1={shape === ButtonShape.CIRCLE}
>
  {#if !isLoading}<slot name="preItem" />{/if}
  {#if isLoading}<LoaderIcon class="animate-spin" />{/if}<slot />
  {#if !isLoading}<slot name="postItem" />{/if}
</button>
