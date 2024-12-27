<script lang="ts">
  import MeltButton from '$lib/components/core/button/melt-button.svelte';
  import { ButtonColor } from '$lib/components/core/button/button.svelte';
  import { type AnyMeltElement } from '@melt-ui/svelte';

  type Props = {
    meltClose: AnyMeltElement;
    title?: string;
  };

  let { meltClose, title = 'Cancel' }: Props = $props();
</script>

<MeltButton color={ButtonColor.NEUTRAL} data-id="close-action" type="button" meltAction={meltClose}>
  {title}
</MeltButton>
