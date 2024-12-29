<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLDivElement> & { meltSeparator: AnyMeltElement };

  let { meltSeparator, ...rest }: Props = $props();
</script>

<div data-id="separator" use:melt={$meltSeparator} class="bg-outline m-2xs h-[1px]" {...rest}></div>
