<script lang="ts">
  import Button, { ButtonColor } from '$lib/components/core/button/button.svelte';
</script>

<Button disabled color={ButtonColor.BRAND}>Brand</Button>
<Button disabled color={ButtonColor.NEUTRAL}>Neutral</Button>
<Button disabled color={ButtonColor.SUCCESS}>Success</Button>
<Button disabled color={ButtonColor.INFO}>Info</Button>
<Button disabled color={ButtonColor.WARNING}>Warning</Button>
<Button disabled color={ButtonColor.DANGER}>Danger</Button>
