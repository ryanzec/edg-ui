<script lang="ts">
  import Button, { ButtonColor, ButtonVariant } from '$lib/components/core/button/button.svelte';
</script>

<Button variant={ButtonVariant.FILLED} color={ButtonColor.BRAND}>Brand</Button>
<Button variant={ButtonVariant.FILLED} color={ButtonColor.NEUTRAL}>Neutral</Button>
<Button variant={ButtonVariant.FILLED} color={ButtonColor.SUCCESS}>Success</Button>
<Button variant={ButtonVariant.FILLED} color={ButtonColor.INFO}>Info</Button>
<Button variant={ButtonVariant.FILLED} color={ButtonColor.WARNING}>Warning</Button>
<Button variant={ButtonVariant.FILLED} color={ButtonColor.DANGER}>Danger</Button>
