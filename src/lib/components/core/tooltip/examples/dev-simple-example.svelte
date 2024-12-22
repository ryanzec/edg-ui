<script>
  import PlusIcon from '$lib/components/core/icons/plus-icon.svelte';
  import Tooltip from '$lib/components/core/tooltip/tooltip.svelte';
</script>

<div>
  <h1>Tooltip</h1>
  <Tooltip>
    {#snippet handle()}
      <button type="button" aria-label="Add">
        <PlusIcon />
      </button>
    {/snippet}
    {#snippet content()}
      <div>My tooltip content</div>
    {/snippet}
  </Tooltip>
</div>
