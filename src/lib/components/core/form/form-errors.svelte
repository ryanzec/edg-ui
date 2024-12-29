<script lang="ts">
  import Callout, { CalloutColor, type CalloutProps } from '$lib/components/core/callout/callout.svelte';
  import type { Snippet } from 'svelte';

  type Props = CalloutProps & { children?: Snippet };

  let { children, ...rest }: Props = $props();
</script>

<Callout {...rest} color={CalloutColor.DANGER}>
  {@render children?.()}
</Callout>
