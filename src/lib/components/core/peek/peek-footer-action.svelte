<script lang="ts">
  import Button from '$lib/components/core/button/button.svelte';

  type Props = {
    title: string;
    onclick: (event: Event) => void;
  };

  let { title, onclick }: Props = $props();
</script>

<Button data-id="action" type="button" {onclick}>
  {title}
</Button>
