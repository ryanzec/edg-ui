<script lang="ts">
  import Callout, { CalloutVariant, CalloutColor } from '$lib/components/core/callout/callout.svelte';
</script>

<div class="gap-xs flex flex-col items-start">
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.BRAND}>Brand</Callout>
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.NEUTRAL}>Neutral</Callout>
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.SUCCESS}>Success</Callout>
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.INFO}>Info</Callout>
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.WARNING}>Warning</Callout>
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.DANGER}>Danger</Callout>
</div>
