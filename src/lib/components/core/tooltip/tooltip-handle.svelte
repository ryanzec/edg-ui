<script lang="ts">
  type Props = {
    class?: string;
    children?: import('svelte').Snippet;
  };

  let { class: extraClass = '', children }: Props = $props();
</script>

<span data-id="handle" class={extraClass} data-tooltip-handle>{@render children?.()}</span>
