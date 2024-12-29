<script lang="ts">
  import Badge, { BadgeColor } from '$lib/components/core/badge/badge.svelte';
</script>

<div class="gap-xs flex flex-col items-start">
  <Badge color={BadgeColor.BRAND}>Primary</Badge>
  <Badge color={BadgeColor.NEUTRAL}>Neutral</Badge>
  <Badge color={BadgeColor.SUCCESS}>Success</Badge>
  <Badge color={BadgeColor.INFO}>Info</Badge>
  <Badge color={BadgeColor.WARNING}>Warning</Badge>
  <Badge color={BadgeColor.DANGER}>Danger</Badge>
</div>
