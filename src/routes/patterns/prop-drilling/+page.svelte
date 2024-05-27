<script lang="ts">
  import PropDrill from '$lib/components/application/prop-drill/prop-drill.svelte';
  import { PROP_DRILL_CONTEXT_KEY, type PropDrillContext } from '$lib/components/application/prop-drill/utils';
  import { onDestroy, setContext } from 'svelte';

  setContext<PropDrillContext>(PROP_DRILL_CONTEXT_KEY, {
    value: 'prop drill value',
    callback: () => {
      console.log('prop drill callback');
    },
  });

  onDestroy(() => {
    setContext(PROP_DRILL_CONTEXT_KEY, undefined);
  });
</script>

<div>Prop drilling can be a tedious process and makes it difficult to debug, make changes, or debug.</div>
<PropDrill />
