<script module lang="ts">
  import { type AnyMeltElement } from '@melt-ui/svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export type DialogHeaderProps = HTMLAttributes<HTMLDivElement> & {
    meltTitle: AnyMeltElement;
    meltClose: AnyMeltElement;
    title: string;
  };
</script>

<script lang="ts">
  import { melt } from '@melt-ui/svelte';
  import Icon from '$lib/components/core/icons/icon.svelte';
  import { tailwindUtils } from '$lib/utils/tailwind';
  import Button, { ButtonShape, ButtonVariant, ButtonColor } from '$lib/components/core/button/button.svelte';

  let { meltTitle, meltClose, title, class: extraClass = '', ...rest }: DialogHeaderProps = $props();
</script>

<div
  data-id="header"
  class={tailwindUtils.merge('px-sm py-xs border-outline flex items-center border-b', extraClass)}
  {...rest}
>
  <h2 use:melt={$meltTitle} class="m-none tracking-lg text-xl font-semibold">
    {title}
  </h2>
  <Button
    {...$meltClose}
    shape={ButtonShape.CIRCLE}
    variant={ButtonVariant.GHOST}
    color={ButtonColor.NEUTRAL}
    action={$meltClose.action}
    aria-label="close"
    class="ml-auto"
  >
    <Icon icon="x" />
  </Button>
</div>
