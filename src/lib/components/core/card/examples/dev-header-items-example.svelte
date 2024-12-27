<script lang="ts">
  import Card from '$lib/components/core/card/card.svelte';
  import CardHeader from '$lib/components/core/card/card-header.svelte';
  import CardContent from '$lib/components/core/card/card-content.svelte';
  import CardFooter from '$lib/components/core/card/card-footer.svelte';
  import Icon from '$lib/components/core/icons/icon.svelte';
  import Button, { ButtonShape, ButtonVariant } from '$lib/components/core/button/button.svelte';

  let cardIsActive: boolean = $state(true);
</script>

<div class="flex items-start">
  {#if cardIsActive}
    <Card>
      <CardHeader label="Header">
        {#snippet preItem()}
          <Icon icon="check" class="h-2xl w-2xl" />
        {/snippet}
        {#snippet postItem()}
          <Button
            class="ml-auto"
            onclick={() => (cardIsActive = false)}
            shape={ButtonShape.CIRCLE}
            variant={ButtonVariant.GHOST}><Icon icon="x" /></Button
          >
        {/snippet}
      </CardHeader>
      <CardContent>This is the content for the card</CardContent>
      <CardFooter class="flex justify-end">Footer</CardFooter>
    </Card>
  {/if}
</div>

{#if !cardIsActive}
  <Button onclick={() => (cardIsActive = true)}>Show Card</Button>
{/if}
