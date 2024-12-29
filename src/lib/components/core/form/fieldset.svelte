<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type FieldsetProps = HTMLAttributes<HTMLFieldSetElement> & { children?: import('svelte').Snippet };
</script>

<script lang="ts">
  let { children, ...rest }: FieldsetProps = $props();
</script>

<fieldset {...rest}>{@render children?.()}</fieldset>
