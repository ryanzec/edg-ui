<script lang="ts">
  import Callout, { CalloutVariant, CalloutColor } from '$lib/components/core/callout/callout.svelte';
</script>

<div class="gap-xs flex flex-col items-start">
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.BRAND} preIcon="chevron-down" label="Brand" />
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.NEUTRAL} postIcon="chevron-down" label="Neutral" />
  <Callout
    variant={CalloutVariant.FILLED}
    color={CalloutColor.SUCCESS}
    preIcon="chevron-down"
    postIcon="chevron-down"
    label="Success"
  />
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.INFO} preIcon="chevron-down" label="Info" />
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.WARNING} postIcon="chevron-down" label="Warning" />
  <Callout
    variant={CalloutVariant.FILLED}
    color={CalloutColor.DANGER}
    preIcon="chevron-down"
    postIcon="chevron-down"
    label="Danger"
  />

  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.BRAND} preIcon="chevron-down" label="Brand" />
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.NEUTRAL} postIcon="chevron-down" label="Neutral" />
  <Callout
    variant={CalloutVariant.WEAK}
    color={CalloutColor.SUCCESS}
    preIcon="chevron-down"
    postIcon="chevron-down"
    label="Success"
  />
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.INFO} preIcon="chevron-down" label="Info" />
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.WARNING} postIcon="chevron-down" label="Warning" />
  <Callout
    variant={CalloutVariant.WEAK}
    color={CalloutColor.DANGER}
    preIcon="chevron-down"
    postIcon="chevron-down"
    label="Danger"
  />
</div>
