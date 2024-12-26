<script lang="ts">
  import Badge, { BadgeShape, BadgeVariant, BadgeColor } from '../badge.svelte';
</script>

<div class="gap-xs flex flex-col items-start">
  <Badge variant={BadgeVariant.WEAK} color={BadgeColor.BRAND} shape={BadgeShape.ROUNDED}>Primary</Badge>
  <Badge variant={BadgeVariant.WEAK} color={BadgeColor.NEUTRAL} shape={BadgeShape.PILL}>Neutral</Badge>
  <Badge variant={BadgeVariant.WEAK} color={BadgeColor.SUCCESS} shape={BadgeShape.ROUNDED}>Success</Badge>
  <Badge variant={BadgeVariant.FILLED} color={BadgeColor.INFO} shape={BadgeShape.PILL}>Info</Badge>
  <Badge variant={BadgeVariant.FILLED} color={BadgeColor.WARNING} shape={BadgeShape.ROUNDED}>Warning</Badge>
  <Badge variant={BadgeVariant.FILLED} color={BadgeColor.DANGER} shape={BadgeShape.PILL}>Danger</Badge>
</div>
