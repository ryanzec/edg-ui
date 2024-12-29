<script module lang="ts">
  import { type DropDownItemProps } from '$lib/components/core/drop-down/drop-down-item.svelte';

  export type DropDownSubTriggerProps = DropDownItemProps & { children?: import('svelte').Snippet };
</script>

<script lang="ts">
  import DropDownItem from '$lib/components/core/drop-down/drop-down-item.svelte';
  import Icon from '$lib/components/core/icons/icon.svelte';

  let { children, ...rest }: DropDownSubTriggerProps = $props();
</script>

<DropDownItem data-id="sub-trigger" {...rest}>
  {@render children?.()}
  {#snippet rightContent()}
    <div>
      <Icon icon="chevron-right" />
    </div>
  {/snippet}
</DropDownItem>
