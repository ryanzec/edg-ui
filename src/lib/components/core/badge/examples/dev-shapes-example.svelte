<script lang="ts">
  import Badge, { BadgeShape, BadgeStrength, BadgeColor } from '../badge.svelte';
</script>

<div class="gap-xs flex flex-col items-start">
  <Badge strength={BadgeStrength.WEAK} color={BadgeColor.BRAND} shape={BadgeShape.ROUNDED}>Primary</Badge>
  <Badge strength={BadgeStrength.WEAK} color={BadgeColor.NEUTRAL} shape={BadgeShape.PILL}>Neutral</Badge>
  <Badge strength={BadgeStrength.WEAK} color={BadgeColor.SUCCESS} shape={BadgeShape.ROUNDED}>Success</Badge>
  <Badge strength={BadgeStrength.STRONG} color={BadgeColor.INFO} shape={BadgeShape.PILL}>Info</Badge>
  <Badge strength={BadgeStrength.STRONG} color={BadgeColor.WARNING} shape={BadgeShape.ROUNDED}>Warning</Badge>
  <Badge strength={BadgeStrength.STRONG} color={BadgeColor.DANGER} shape={BadgeShape.PILL}>Danger</Badge>
</div>
