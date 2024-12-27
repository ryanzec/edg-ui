<script lang="ts">
  import List from '$lib/components/core/list/list.svelte';
  import ListItem from '$lib/components/core/list/list-item.svelte';
</script>

<List>
  <ListItem preIcon="chevron-right">Item1</ListItem>
  <ListItem preIcon="chevron-left">Item2</ListItem>
  <ListItem preIcon="x">Item3</ListItem>
</List>
