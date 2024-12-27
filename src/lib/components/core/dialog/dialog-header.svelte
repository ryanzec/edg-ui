<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import Icon from '$lib/components/core/icons/icon.svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { tailwindUtils } from '$lib/utils/tailwind';
  import Button, { ButtonShape, ButtonVariant } from '$lib/components/core/button/button.svelte';

  type Props = HTMLAttributes<HTMLDivElement> & {
    meltTitle: AnyMeltElement;
    meltClose: AnyMeltElement;
    title: string;
  };

  let { meltTitle, meltClose, title, class: extraClass = '', ...rest }: Props = $props();
</script>

<div
  data-id="header"
  class={tailwindUtils.merge('px-sm py-xs border-outline flex items-center border-b', extraClass)}
  {...rest}
>
  <h2 use:melt={$meltTitle} class="m-none tracking-lg text-lg font-medium">
    {title}
  </h2>
  <Button
    {...$meltClose}
    shape={ButtonShape.CIRCLE}
    variant={ButtonVariant.GHOST}
    action={$meltClose.action}
    aria-label="close"
    class="ml-auto"
  >
    <Icon icon="x" />
  </Button>
</div>
