<script module lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export type CardHeaderProps = HTMLAttributes<HTMLDivElement> & {
    preItem?: Snippet;
    postItem?: Snippet;
    label: string;
  };
</script>

<script lang="ts">
  import { tailwindUtils } from '$lib/utils/tailwind';

  let { preItem, postItem, label, class: extraClass = '', ...rest }: CardHeaderProps = $props();
</script>

<div class={tailwindUtils.merge('gap-xs tracking-x flex items-center text-xl font-semibold', extraClass)} {...rest}>
  {@render preItem?.()}
  <span>{label}</span>
  {@render postItem?.()}
</div>
