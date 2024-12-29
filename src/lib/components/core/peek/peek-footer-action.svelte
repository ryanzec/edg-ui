<script lang="ts">
  import Button, { type ButtonProps } from '$lib/components/core/button/button.svelte';

  type Props = ButtonProps & {
    title: string;
    onclick: (event: Event) => void;
  };

  let { title, onclick, ...rest }: Props = $props();
</script>

<Button data-id="action" {...rest} type="button" {onclick}>
  {title}
</Button>
