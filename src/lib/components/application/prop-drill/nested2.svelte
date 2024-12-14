<script lang="ts">
  import Button from '$lib/components/core/button/button.svelte';
  import { getContext } from 'svelte';
  import { PROP_DRILL_CONTEXT_KEY, type PropDrillContext } from './utils';

  const componentContext = getContext<PropDrillContext | undefined>(PROP_DRILL_CONTEXT_KEY);
</script>

<div>Deeply nested component</div>
<div>Value: {componentContext?.value}</div>
<Button onclick={() => componentContext?.callback()}>Callback</Button>
