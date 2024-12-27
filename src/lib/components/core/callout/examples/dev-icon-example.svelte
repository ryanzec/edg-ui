<script lang="ts">
  import Callout, { CalloutVariant, CalloutColor } from '$lib/components/core/callout/callout.svelte';
  import Icon from '$lib/components/core/icons/icon.svelte';
</script>

<div class="gap-xs flex flex-col items-start">
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.BRAND}>
    {#snippet preItem()}
      <Icon icon="chevron-down" />
    {/snippet}
    Brand
  </Callout>
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.NEUTRAL}>
    Neutral
    {#snippet postItem()}
      <Icon icon="chevron-down" />
    {/snippet}
  </Callout>
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.SUCCESS}>
    {#snippet preItem()}
      <Icon icon="chevron-down" />
    {/snippet}
    Success
    {#snippet postItem()}
      <Icon icon="chevron-down" />
    {/snippet}
  </Callout>
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.INFO}>
    {#snippet preItem()}
      <Icon icon="chevron-down" />
    {/snippet}
    Info
  </Callout>
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.WARNING}>
    Warning
    {#snippet postItem()}
      <Icon icon="chevron-down" />
    {/snippet}</Callout
  >
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.DANGER}>
    {#snippet preItem()}
      <Icon icon="chevron-down" />
    {/snippet}
    Danger
    {#snippet postItem()}
      <Icon icon="chevron-down" />
    {/snippet}
  </Callout>

  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.BRAND}>
    {#snippet preItem()}
      <Icon icon="chevron-down" />
    {/snippet}
    Brand
  </Callout>
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.NEUTRAL}>
    Neutral
    {#snippet postItem()}
      <Icon icon="chevron-down" />
    {/snippet}</Callout
  >
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.SUCCESS}>
    {#snippet preItem()}
      <Icon icon="chevron-down" />
    {/snippet}
    Success
    {#snippet postItem()}
      <Icon icon="chevron-down" />
    {/snippet}
  </Callout>
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.INFO}>
    {#snippet preItem()}
      <Icon icon="chevron-down" />
    {/snippet}
    Info
  </Callout>
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.WARNING}>
    Warning
    {#snippet postItem()}
      <Icon icon="chevron-down" />
    {/snippet}</Callout
  >
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.DANGER}>
    {#snippet preItem()}
      <Icon icon="chevron-down" />
    {/snippet}
    Danger
    {#snippet postItem()}
      <Icon icon="chevron-down" />
    {/snippet}
  </Callout>
</div>
