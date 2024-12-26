<script lang="ts">
  import Callout, { CalloutVariant, CalloutColor } from '$lib/components/core/callout/callout.svelte';
</script>

<div class="gap-xs flex flex-col items-start">
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.BRAND} preIcon="chevron-down">Brand</Callout>
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.NEUTRAL} postIcon="chevron-down">Neutral</Callout>
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.SUCCESS} preIcon="chevron-down" postIcon="chevron-down">
    Success
  </Callout>
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.INFO} preIcon="chevron-down">Info</Callout>
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.WARNING} postIcon="chevron-down">Warning</Callout>
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.DANGER} preIcon="chevron-down" postIcon="chevron-down">
    Danger
  </Callout>

  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.BRAND} preIcon="chevron-down">Brand</Callout>
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.NEUTRAL} postIcon="chevron-down">Neutral</Callout>
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.SUCCESS} preIcon="chevron-down" postIcon="chevron-down">
    Success
  </Callout>
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.INFO} preIcon="chevron-down">Info</Callout>
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.WARNING} postIcon="chevron-down">Warning</Callout>
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.DANGER} preIcon="chevron-down" postIcon="chevron-down">
    Danger
  </Callout>
</div>
