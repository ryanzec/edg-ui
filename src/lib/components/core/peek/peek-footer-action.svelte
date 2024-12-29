<script module lang="ts">
  import { type ButtonProps } from '$lib/components/core/button/button.svelte';

  export type PeekFooterActionProps = ButtonProps & {
    title: string;
    onclick: (event: Event) => void;
  };
</script>

<script lang="ts">
  import Button from '$lib/components/core/button/button.svelte';

  let { title, onclick, ...rest }: PeekFooterActionProps = $props();
</script>

<Button data-id="action" {...rest} type="button" {onclick}>
  {title}
</Button>
