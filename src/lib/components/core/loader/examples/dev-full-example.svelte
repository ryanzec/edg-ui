<script lang="ts">
  import Loader from '$lib/components/core/loader/loader.svelte';
  import Button from '$lib/components/core/button/button.svelte';

  let isActive = $state(false);

  const handleShowLoader = () => {
    isActive = true;

    setTimeout(() => {
      isActive = false;
    }, 2000);
  };
</script>

{#if !isActive}
  <Button onclick={handleShowLoader}>Show Full Loader</Button>
{/if}
<div class="border-outline relative h-[200px] w-[500px] border"><Loader isActive={!isActive} isFixed={false} /></div>
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
For testing scrolling
<Loader {isActive} />
