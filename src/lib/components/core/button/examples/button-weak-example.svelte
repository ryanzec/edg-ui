<script lang="ts">
  import Button, { ButtonColor, ButtonVariant } from '$lib/components/core/button/button.svelte';
</script>

<Button variant={ButtonVariant.WEAK} color={ButtonColor.BRAND}>Brand</Button>
<Button variant={ButtonVariant.WEAK} color={ButtonColor.NEUTRAL}>Neutral</Button>
<Button variant={ButtonVariant.WEAK} color={ButtonColor.SUCCESS}>Success</Button>
<Button variant={ButtonVariant.WEAK} color={ButtonColor.INFO}>Info</Button>
<Button variant={ButtonVariant.WEAK} color={ButtonColor.WARNING}>Warning</Button>
<Button variant={ButtonVariant.WEAK} color={ButtonColor.DANGER}>Danger</Button>
