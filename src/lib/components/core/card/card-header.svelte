<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { tailwindUtils } from '$lib/utils/tailwind';

  type Props = HTMLAttributes<HTMLDivElement> & {
    preItem?: Snippet;
    postItem?: Snippet;
    label: string;
  };

  let { preItem, postItem, label, class: extraClass = '', ...rest }: Props = $props();
</script>

<div class={tailwindUtils.merge('gap-xs tracking-x flex items-center text-xl font-semibold', extraClass)} {...rest}>
  {@render preItem?.()}
  <span>{label}</span>
  {@render postItem?.()}
</div>
