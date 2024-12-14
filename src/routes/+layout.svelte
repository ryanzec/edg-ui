<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import '../app.css';

  type Props = { children?: import('svelte').Snippet };

  let { children }: Props = $props();

  if (browser) {
    // @todo(investigate) is there a way to avoid the flicker of the light version
    // @todo(feature) add ability to override this
    // const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    // document.body.dataset.theme = isDarkMode ? 'dark' : 'light';
  }

  onMount(() => {
    // this allows for the page to know when svelte has hydrated and the page is now interactive
    document.body.dataset.hydrated = 'true';
  });
</script>

{@render children?.()}
