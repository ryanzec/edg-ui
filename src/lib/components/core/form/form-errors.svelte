<script module lang="ts">
  import { type CalloutProps } from '$lib/components/core/callout/callout.svelte';
  import type { Snippet } from 'svelte';

  export type FormErrorsProps = CalloutProps & { children?: Snippet };
</script>

<script lang="ts">
  import Callout, { CalloutColor } from '$lib/components/core/callout/callout.svelte';

  let { children, ...rest }: FormErrorsProps = $props();
</script>

<Callout {...rest} color={CalloutColor.DANGER}>
  {@render children?.()}
</Callout>
