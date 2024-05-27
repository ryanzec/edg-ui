<script lang="ts">
  import Button, { ButtonColor, ButtonShape } from '$lib/components/core/button/button.svelte';
</script>

<Button shape={ButtonShape.PILL} color={ButtonColor.BRAND}>Brand</Button>
<Button shape={ButtonShape.PILL} color={ButtonColor.NEUTRAL}>Neutral</Button>
<Button shape={ButtonShape.PILL} color={ButtonColor.SUCCESS}>Success</Button>
<Button shape={ButtonShape.PILL} color={ButtonColor.INFO}>Info</Button>
<Button shape={ButtonShape.PILL} color={ButtonColor.WARNING}>Warning</Button>
<Button shape={ButtonShape.PILL} color={ButtonColor.DANGER}>Danger</Button>
