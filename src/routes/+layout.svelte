<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import '../app.css';
  import { applicationStore, ApplicationThemeMode } from '$lib/stores/application.store';

  type Props = { children?: import('svelte').Snippet };

  let { children }: Props = $props();

  $effect(() => {
    if (!browser) {
      return;
    }

    // @todo(investigate) is there a way to avoid the flicker of the light version
    document.body.dataset.theme = $applicationStore.themeMode === ApplicationThemeMode.DARK ? 'dark' : 'light';
  });

  onMount(() => {
    // this allows for the page to know when svelte has hydrated and the page is now interactive
    document.body.dataset.hydrated = 'true';
  });
</script>

{@render children?.()}
