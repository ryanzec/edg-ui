<script lang="ts">
  import Badge, { BadgeShape, BadgeVariant, BadgeColor } from '../badge.svelte';
</script>

<div class="gap-xs flex flex-col items-start">
  <Badge variant={BadgeVariant.WEAK} color={BadgeColor.BRAND} shape={BadgeShape.ROUNDED} preIcon="chevron-down">
    Primary
  </Badge>
  <Badge variant={BadgeVariant.WEAK} color={BadgeColor.NEUTRAL} shape={BadgeShape.PILL} postIcon="chevron-up">
    Neutral
  </Badge>
  <Badge
    variant={BadgeVariant.WEAK}
    color={BadgeColor.SUCCESS}
    shape={BadgeShape.ROUNDED}
    preIcon="chevron-down"
    postIcon="chevron-up">Success</Badge
  >
</div>
