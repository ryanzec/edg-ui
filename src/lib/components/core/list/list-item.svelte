<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import Icon from '$lib/components/core/icons/icon.svelte';
  import type { IconName } from '$lib/components/core/icons/utils';

  type Props = HTMLAttributes<HTMLLIElement> & {
    children: import('svelte').Snippet;
    preIcon?: IconName;
  };

  let { children, preIcon }: Props = $props();
</script>

<li class="gap-xs px-xs py-2xs bg-surface-pure border-outline flex items-center border border-b-0 last:border-b">
  {#if preIcon}<Icon icon={preIcon} />{/if}
  {@render children()}
</li>
