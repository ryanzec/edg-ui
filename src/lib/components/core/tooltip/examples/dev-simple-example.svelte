<script>
  import PlusIcon from '$lib/components/core/icons/plus-icon.svelte';
  import Tooltip from '$lib/components/core/tooltip/tooltip.svelte';
</script>

<div>
  <h1>Tooltip</h1>
  <Tooltip>
    <button slot="handle" type="button" aria-label="Add">
      <PlusIcon />
    </button>
    <div slot="content">My tooltip content</div>
  </Tooltip>
</div>
