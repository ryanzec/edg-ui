<script lang="ts">
  let extraClass = '';
  export { extraClass as class };
</script>

<div
  data-id="content"
  class="absolute rounded bg-surface-on-base px-2 py-1 text-inverse-base opacity-0 transition-opacity duration-[250ms] {extraClass}"
  data-tooltip-content
>
  <slot />
</div>
<div>Other Content</div>
