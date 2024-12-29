<script lang="ts">
  import Badge, { BadgeColor, BadgeVariant } from '$lib/components/core/badge/badge.svelte';
</script>

<div class="gap-xs flex flex-col items-start">
  <Badge variant={BadgeVariant.WEAK} color={BadgeColor.BRAND}>Primary</Badge>
  <Badge variant={BadgeVariant.WEAK} color={BadgeColor.NEUTRAL}>Neutral</Badge>
  <Badge variant={BadgeVariant.WEAK} color={BadgeColor.SUCCESS}>Success</Badge>
  <Badge variant={BadgeVariant.WEAK} color={BadgeColor.INFO}>Info</Badge>
  <Badge variant={BadgeVariant.WEAK} color={BadgeColor.WARNING}>Warning</Badge>
  <Badge variant={BadgeVariant.WEAK} color={BadgeColor.DANGER}>Danger</Badge>

  <Badge variant={BadgeVariant.FILLED} color={BadgeColor.BRAND}>Primary</Badge>
  <Badge variant={BadgeVariant.FILLED} color={BadgeColor.NEUTRAL}>Neutral</Badge>
  <Badge variant={BadgeVariant.FILLED} color={BadgeColor.SUCCESS}>Success</Badge>
  <Badge variant={BadgeVariant.FILLED} color={BadgeColor.INFO}>Info</Badge>
  <Badge variant={BadgeVariant.FILLED} color={BadgeColor.WARNING}>Warning</Badge>
  <Badge variant={BadgeVariant.FILLED} color={BadgeColor.DANGER}>Danger</Badge>
</div>
