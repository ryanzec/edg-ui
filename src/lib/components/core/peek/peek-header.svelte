<script module lang="ts">
  import { type AnyMeltElement } from '@melt-ui/svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export type PeekHeaderProps = HTMLAttributes<HTMLHeadingElement> & {
    meltTitle: AnyMeltElement;
    meltClose: AnyMeltElement;
    title: string;
  };
</script>

<script lang="ts">
  import { melt } from '@melt-ui/svelte';
  import Icon from '$lib/components/core/icons/icon.svelte';
  import Button, { ButtonColor, ButtonShape, ButtonVariant } from '$lib/components/core/button/button.svelte';
  import { tailwindUtils } from '$lib/utils/tailwind';

  let { meltTitle, meltClose, title, class: extraClass = '', ...rest }: PeekHeaderProps = $props();
</script>

<h2
  data-id="header"
  use:melt={$meltTitle}
  class={tailwindUtils.merge(
    'border-outline p-base flex items-center justify-between border-b text-xl font-semibold',
    extraClass,
  )}
  {...rest}
>
  {title}
  <Button
    {...$meltClose}
    shape={ButtonShape.CIRCLE}
    variant={ButtonVariant.GHOST}
    color={ButtonColor.NEUTRAL}
    action={$meltClose.action}
    aria-label="close"
  >
    <Icon icon="x" />
  </Button>
</h2>
