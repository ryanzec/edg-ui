<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { tailwindUtils } from '$lib/utils/tailwind';

  type Props = HTMLAttributes<HTMLInputElement> & {
    value: string;
    name: string;
    id?: string;
    disabled?: boolean;
    readonly?: boolean;
  };

  let { value = $bindable(), name, id = name as string, class: extraClass = '', ...rest }: Props = $props();
  let isEnabled = $derived(!rest.disabled && !rest.readonly);
</script>

<input
  autocomplete="off"
  {...rest}
  {id}
  {name}
  class={tailwindUtils.merge(
    'border-outline bg-input-background px-xs py-2xs rounded-sm border outline-hidden',
    extraClass,
    {
      'hover:border-outline-active focus:border-outline-active': isEnabled,
      'cursor-not-allowed': !isEnabled,
      'opacity-disabled': rest.disabled,
      'bg-secondary': rest.readonly,
    },
  )}
  bind:value
  type="text"
/>
