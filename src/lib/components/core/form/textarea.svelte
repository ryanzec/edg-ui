<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLTextAreaElement> & {
    value?: string;
    name: string;
    id?: string;
  };

  let { value = $bindable(''), name, id = name, ...rest }: Props = $props();
</script>

<textarea
  autocomplete="off"
  {...rest}
  {id}
  {name}
  class="p-input border-outline bg-input-background hover:border-outline-active focus:border-outline-active rounded-sm border px-2 py-1 outline-hidden"
  bind:value
></textarea>
