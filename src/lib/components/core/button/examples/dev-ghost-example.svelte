<script lang="ts">
  import Button, { ButtonColor, ButtonVariant } from '$lib/components/core/button/button.svelte';
</script>

<Button variant={ButtonVariant.GHOST} color={ButtonColor.BRAND}>Brand</Button>
<Button variant={ButtonVariant.GHOST} color={ButtonColor.NEUTRAL}>Neutral</Button>
<Button variant={ButtonVariant.GHOST} color={ButtonColor.SUCCESS}>Success</Button>
<Button variant={ButtonVariant.GHOST} color={ButtonColor.INFO}>Info</Button>
<Button variant={ButtonVariant.GHOST} color={ButtonColor.WARNING}>Warning</Button>
<Button variant={ButtonVariant.GHOST} color={ButtonColor.DANGER}>Danger</Button>
