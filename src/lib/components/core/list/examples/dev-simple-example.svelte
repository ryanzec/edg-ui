<script lang="ts">
  import List, { ListShape } from '$lib/components/core/list/list.svelte';
  import ListItem from '$lib/components/core/list/list-item.svelte';
</script>

<div class="gap-sm flex flex-col">
  <List>
    <ListItem>Item1</ListItem>
    <ListItem>Item2</ListItem>
    <ListItem>Item3</ListItem>
  </List>
  <List shape={ListShape.ROUNDED}>
    <ListItem>Item1</ListItem>
    <ListItem>Item2</ListItem>
    <ListItem>Item3</ListItem>
  </List>
</div>
