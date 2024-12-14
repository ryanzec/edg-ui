<script lang="ts">
  import XIcon from '$lib/components/core/icons/x-icon.svelte';

  import Button from '$lib/components/core/button/button.svelte';
</script>

<Button>{#snippet preItem()}
    <XIcon  />
  {/snippet}Pre Item</Button>
<Button>Post Item{#snippet postItem()}
    <XIcon  />
  {/snippet}</Button>
<Button>{#snippet preItem()}
    <XIcon  />
  {/snippet}Pre and Post Item{#snippet postItem()}
    <XIcon  />
  {/snippet}</Button>
<Button isLoading>{#snippet preItem()}
    <XIcon  />
  {/snippet}Is Loading Hides Items{#snippet postItem()}
    <XIcon  />
  {/snippet}</Button>
