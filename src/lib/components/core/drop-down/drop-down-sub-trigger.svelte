<script lang="ts">
  import { type AnyMeltElement } from '@melt-ui/svelte';
  import DropDownItem from '$lib/components/core/drop-down/drop-down-item.svelte';
  import ChevronRightIcon from '../icons/chevron-right-icon.svelte';

  interface Props {
    subTrigger: AnyMeltElement;
    children?: import('svelte').Snippet;
  }

  let { subTrigger, children }: Props = $props();
</script>

<DropDownItem data-id="sub-trigger" meltItem={$subTrigger}>
  {@render children?.()}
  {#snippet rightContent()}
    <div >
      <ChevronRightIcon class="size-4" />
    </div>
  {/snippet}
</DropDownItem>
