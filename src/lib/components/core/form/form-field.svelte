<script lang="ts">
  import ValidationMessages from '$lib/components/core/form/validation-messages.svelte';
  import type { WithFormFieldErrors } from '$lib/stores/form-manager.store';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLDivElement> & {
    error?: WithFormFieldErrors | undefined;
    children?: import('svelte').Snippet;
  };

  let { error = undefined, children, ...rest }: Props = $props();
</script>

<div data-id="form-field" {...rest} class="gap-xs flex flex-col">
  {@render children?.()}
  <ValidationMessages {error} />
</div>
