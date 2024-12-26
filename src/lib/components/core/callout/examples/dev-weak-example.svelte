<script lang="ts">
  import Callout, { CalloutVariant, CalloutColor } from '$lib/components/core/callout/callout.svelte';
</script>

<div class="gap-xs flex flex-col items-start">
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.BRAND} label="Brand" />
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.NEUTRAL} label="Neutral" />
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.SUCCESS} label="Success" />
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.INFO} label="Info" />
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.WARNING} label="Warning" />
  <Callout variant={CalloutVariant.WEAK} color={CalloutColor.DANGER} label="Danger" />
</div>
