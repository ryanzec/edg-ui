<script lang="ts">
  import Icon from '$lib/components/core/icons/icon.svelte';

  import Button from '$lib/components/core/button/button.svelte';
</script>

<Button>
  {#snippet preItem()}
    <Icon icon="x" />
  {/snippet}
  Pre Item
</Button>
<Button>
  Post Item
  {#snippet postItem()}
    <Icon icon="x" />
  {/snippet}
</Button>
<Button>
  {#snippet preItem()}
    <Icon icon="x" />
  {/snippet}
  Pre and Post Item
  {#snippet postItem()}
    <Icon icon="x" />
  {/snippet}
</Button>
<Button isLoading>
  {#snippet preItem()}
    <Icon icon="x" />
  {/snippet}
  Is Loading Hides Items
  {#snippet postItem()}
    <Icon icon="x" />
  {/snippet}
</Button>
