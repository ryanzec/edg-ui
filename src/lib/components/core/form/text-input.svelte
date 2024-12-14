<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLInputElement> & {
    value: string;
    name: string;
    id?: string;
  };

  let { value = $bindable(), name, id = name as string, ...rest }: Props = $props();
</script>

<input
  autocomplete="off"
  {...rest}
  {id}
  {name}
  class="p-input rounded border border-outline bg-input-background px-2 py-1 outline-none hover:border-outline-active focus:border-outline-active"
  bind:value
  type="text"
/>
