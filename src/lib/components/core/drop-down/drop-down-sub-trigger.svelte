<script lang="ts">
  import DropDownItem, { type DropDownItemProps } from '$lib/components/core/drop-down/drop-down-item.svelte';
  import Icon from '$lib/components/core/icons/icon.svelte';

  type Props = DropDownItemProps & { children?: import('svelte').Snippet };

  let { children, ...rest }: Props = $props();
</script>

<DropDownItem data-id="sub-trigger" {...rest}>
  {@render children?.()}
  {#snippet rightContent()}
    <div>
      <Icon icon="chevron-right" />
    </div>
  {/snippet}
</DropDownItem>
