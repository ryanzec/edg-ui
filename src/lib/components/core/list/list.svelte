<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLUListElement> & { children: import('svelte').Snippet };

  let { children }: Props = $props();
</script>

<ul class="flex flex-col">
  {@render children()}
</ul>
