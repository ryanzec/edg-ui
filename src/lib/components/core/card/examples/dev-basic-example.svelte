<script lang="ts">
  import Card from '$lib/components/core/card/card.svelte';
  import CardHeader from '$lib/components/core/card/card-header.svelte';
  import CardContent from '$lib/components/core/card/card-content.svelte';
  import CardFooter from '$lib/components/core/card/card-footer.svelte';
</script>

<div class="flex items-start">
  <Card>
    <CardHeader label="Header" />
    <CardContent>This is the content for the card</CardContent>
    <CardFooter class="flex justify-end">Footer</CardFooter>
  </Card>
</div>
