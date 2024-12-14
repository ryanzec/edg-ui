<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  interface Props {
    title: string;
  }

  let { title }: Props = $props();
</script>

<button data-id="action" type="button" onclick={bubble('click')}>
  {title}
</button>
