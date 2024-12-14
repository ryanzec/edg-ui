<script lang="ts">
  import Badge, { BadgeShape } from '../badge.svelte';
</script>

<div class="flex flex-col items-start gap-2">
  <Badge shape={BadgeShape.ROUNDED}>Rounded</Badge>
  <Badge shape={BadgeShape.PILL}>Pill</Badge>
</div>
