<script>
  import ScrollArea from '$lib/components/core/scroll-area/scroll-area.svelte';

  const flavors = ['Vanilla', 'Chocolate', 'Strawberry', 'Cookie dough', 'Caramel', 'Pumpkin', 'Toffee'];
</script>

<ScrollArea class="h-[200px] w-[50px]">
  <h4 class="mb-base leading-none font-semibold">Endless Flavors</h4>
  {#each flavors as flavor (flavor)}
    <div class="tracking-sm text-sm">
      {flavor}
    </div>
    <div role="separator" class="bg-outline my-xs h-px w-full"></div>
  {/each}
</ScrollArea>
