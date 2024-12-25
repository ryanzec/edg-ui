<script lang="ts">
  import Badge, { BadgeColor, BadgeStrength } from '../badge.svelte';
</script>

<div class="gap-xs flex flex-col items-start">
  <Badge strength={BadgeStrength.WEAK} color={BadgeColor.BRAND}>Primary</Badge>
  <Badge strength={BadgeStrength.WEAK} color={BadgeColor.NEUTRAL}>Neutral</Badge>
  <Badge strength={BadgeStrength.WEAK} color={BadgeColor.SUCCESS}>Success</Badge>
  <Badge strength={BadgeStrength.WEAK} color={BadgeColor.INFO}>Info</Badge>
  <Badge strength={BadgeStrength.WEAK} color={BadgeColor.WARNING}>Warning</Badge>
  <Badge strength={BadgeStrength.WEAK} color={BadgeColor.DANGER}>Danger</Badge>

  <Badge strength={BadgeStrength.STRONG} color={BadgeColor.BRAND}>Primary</Badge>
  <Badge strength={BadgeStrength.STRONG} color={BadgeColor.NEUTRAL}>Neutral</Badge>
  <Badge strength={BadgeStrength.STRONG} color={BadgeColor.SUCCESS}>Success</Badge>
  <Badge strength={BadgeStrength.STRONG} color={BadgeColor.INFO}>Info</Badge>
  <Badge strength={BadgeStrength.STRONG} color={BadgeColor.WARNING}>Warning</Badge>
  <Badge strength={BadgeStrength.STRONG} color={BadgeColor.DANGER}>Danger</Badge>
</div>
