<script lang="ts">
  import Badge, { BadgeColor } from '../badge.svelte';
</script>

<div class="flex flex-col items-start gap-2">
  <Badge color={BadgeColor.BRAND}>Primary</Badge>
  <Badge color={BadgeColor.NEUTRAL}>Neutral</Badge>
  <Badge color={BadgeColor.SUCCESS}>Success</Badge>
  <Badge color={BadgeColor.INFO}>Info</Badge>
  <Badge color={BadgeColor.WARNING}>Warning</Badge>
  <Badge color={BadgeColor.DANGER}>Danger</Badge>
</div>
