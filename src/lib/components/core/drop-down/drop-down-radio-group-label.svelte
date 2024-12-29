<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type DropDownRadioGroupLabelProps = HTMLAttributes<HTMLDivElement> & { children?: import('svelte').Snippet };
</script>

<script lang="ts">
  let { children, ...rest }: DropDownRadioGroupLabelProps = $props();
</script>

<div data-id="label" class="px-xs leading-lg tracking-xs text-xs" {...rest}>{@render children?.()}</div>
