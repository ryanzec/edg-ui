<script lang="ts">
  import Callout, { CalloutColor } from '$lib/components/core/callout/callout.svelte';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet };

  let { children }: Props = $props();
</script>

<Callout color={CalloutColor.DANGER}>
  {@render children?.()}
</Callout>
