<script lang="ts">
  type Props = {
    class?: string;
    children?: import('svelte').Snippet;
  };

  let { class: extraClass = '', children }: Props = $props();
</script>

<div
  data-id="content"
  class="bg-on-surface text-surface-on-inverse absolute rounded-sm px-2 py-1 opacity-0 transition-opacity duration-[250ms] {extraClass}"
  data-tooltip-content
>
  {@render children?.()}
</div>
<div>Other Content</div>
