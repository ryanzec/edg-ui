<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLFieldSetElement> & { children?: import('svelte').Snippet };

  let { children, ...rest }: Props = $props();
</script>

<fieldset {...rest}>{@render children?.()}</fieldset>
