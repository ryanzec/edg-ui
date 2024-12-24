<script lang="ts">
  import Badge, { BadgeShape } from '../badge.svelte';
</script>

<div class="gap-xs flex flex-col items-start">
  <Badge shape={BadgeShape.ROUNDED}>Rounded</Badge>
  <Badge shape={BadgeShape.PILL}>Pill</Badge>
</div>
