<script lang="ts">
  import Callout, { CalloutVariant, CalloutColor } from '$lib/components/core/callout/callout.svelte';
</script>

<div class="gap-xs flex flex-col items-start">
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.BRAND} label="Brand" />
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.NEUTRAL} label="Neutral" />
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.SUCCESS} label="Success" />
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.INFO} label="Info" />
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.WARNING} label="Warning" />
  <Callout variant={CalloutVariant.FILLED} color={CalloutColor.DANGER} label="Danger" />
</div>
