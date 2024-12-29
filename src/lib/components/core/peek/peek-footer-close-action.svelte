<script lang="ts">
  import MeltButton from '$lib/components/core/button/melt-button.svelte';
  import { ButtonColor, type ButtonProps } from '$lib/components/core/button/button.svelte';
  import { type AnyMeltElement } from '@melt-ui/svelte';

  type Props = ButtonProps & {
    meltClose: AnyMeltElement;
    title?: string;
  };

  let { meltClose, title = 'Cancel', ...rest }: Props = $props();
</script>

<MeltButton {...rest} color={ButtonColor.NEUTRAL} data-id="close-action" type="button" meltAction={meltClose}>
  {title}
</MeltButton>
