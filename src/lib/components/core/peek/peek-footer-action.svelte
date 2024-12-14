<script lang="ts">
  interface Props {
    title: string;
    onclick: (event: Event) => void;
  }

  let { title, onclick }: Props = $props();
</script>

<button data-id="action" type="button" {onclick}>
  {title}
</button>
