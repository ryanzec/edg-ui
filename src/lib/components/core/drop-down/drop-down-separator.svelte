<script module lang="ts">
  import { type AnyMeltElement } from '@melt-ui/svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export type DropDownSeparatorProps = HTMLAttributes<HTMLDivElement> & { meltSeparator: AnyMeltElement };
</script>

<script lang="ts">
  import { melt } from '@melt-ui/svelte';

  let { meltSeparator, ...rest }: DropDownSeparatorProps = $props();
</script>

<div data-id="separator" use:melt={$meltSeparator} class="bg-outline m-2xs h-[1px]" {...rest}></div>
