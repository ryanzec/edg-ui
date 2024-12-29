<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import Icon from '$lib/components/core/icons/icon.svelte';
  import Button, { ButtonColor, ButtonShape, ButtonVariant } from '$lib/components/core/button/button.svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLHeadingElement> & {
    meltTitle: AnyMeltElement;
    meltClose: AnyMeltElement;
    title: string;
  };

  let { meltTitle, meltClose, title, ...rest }: Props = $props();
</script>

<h2
  data-id="header"
  use:melt={$meltTitle}
  class="border-outline p-base flex items-center justify-between border-b text-xl font-semibold"
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
