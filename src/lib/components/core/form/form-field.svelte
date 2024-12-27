<script lang="ts">
  import ValidationMessages from '$lib/components/core/form/validation-messages.svelte';
  import type { WithFormFieldErrors } from '$lib/stores/form-manager.store';
  import type { HTMLAttributes } from 'svelte/elements';
  import { tailwindUtils } from '$lib/utils/tailwind';

  type Props = HTMLAttributes<HTMLDivElement> & {
    error?: WithFormFieldErrors | undefined;
    children?: import('svelte').Snippet;
  };

  let { error = undefined, children, class: extraClass = '', ...rest }: Props = $props();
</script>

<div
  data-id="form-field"
  class={tailwindUtils.merge('gap-2xs flex flex-col', extraClass, { 'has-error': !!error })}
  {...rest}
>
  {@render children?.()}
  <ValidationMessages {error} />
</div>
