<script module lang="ts">
  import { type ButtonProps } from '$lib/components/core/button/button.svelte';
  import { type AnyMeltElement } from '@melt-ui/svelte';

  export type PeekFooterCloseActionProps = ButtonProps & {
    meltClose: AnyMeltElement;
    title?: string;
  };
</script>

<script lang="ts">
  import MeltButton from '$lib/components/core/button/melt-button.svelte';
  import { ButtonColor } from '$lib/components/core/button/button.svelte';

  let { meltClose, title = 'Cancel', ...rest }: PeekFooterCloseActionProps = $props();
</script>

<MeltButton {...rest} color={ButtonColor.NEUTRAL} data-id="close-action" type="button" meltAction={meltClose}>
  {title}
</MeltButton>
