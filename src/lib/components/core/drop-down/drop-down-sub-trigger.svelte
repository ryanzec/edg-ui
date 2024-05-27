<script lang="ts">
  import { type AnyMeltElement } from '@melt-ui/svelte';
  import DropDownItem from '$lib/components/core/drop-down/drop-down-item.svelte';
  import ChevronRightIcon from '../icons/chevron-right-icon.svelte';

  export let subTrigger: AnyMeltElement;
</script>

<DropDownItem data-id="sub-trigger" meltItem={$subTrigger}>
  <slot />
  <div slot="rightContent">
    <ChevronRightIcon class="size-4" />
  </div>
</DropDownItem>
