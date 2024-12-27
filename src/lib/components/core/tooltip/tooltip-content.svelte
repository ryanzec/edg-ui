<script lang="ts">
  type Props = {
    class?: string;
    children?: import('svelte').Snippet;
  };

  let { class: extraClass = '', children }: Props = $props();
</script>

<div
  data-id="content"
  class="bg-on-surface text-surface-on-inverse px-xs py-2xs opacity-none absolute rounded-sm transition-opacity duration-[250ms] {extraClass}"
  data-tooltip-content
>
  {@render children?.()}
</div>
