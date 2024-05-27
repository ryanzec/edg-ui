<script lang="ts">
  export let tag: string = 'div';
</script>

<svelte:element this={tag} data-id="typography" {...$$restProps}><slot /></svelte:element>
