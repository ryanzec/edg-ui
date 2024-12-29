<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLDivElement> & {
    class?: string;
    children?: import('svelte').Snippet;
  };

  let { class: extraClass = '', children, ...rest }: Props = $props();
</script>

<div
  data-id="content"
  class="bg-on-surface text-surface-on-inverse px-xs py-2xs opacity-none absolute rounded-sm transition-opacity duration-[250ms] {extraClass}"
  data-tooltip-content
  {...rest}
>
  {@render children?.()}
</div>
