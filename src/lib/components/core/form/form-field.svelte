<script lang="ts">
  import ValidationMessages from '$lib/components/core/form/validation-messages.svelte';
  import type { WithFormFieldErrors } from '$lib/stores/form-manager.store';

  interface Props {
    error?: WithFormFieldErrors | undefined;
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let { error = undefined, children, ...rest }: Props = $props();
</script>

<div data-id="form-field" {...rest} class="gap-label flex flex-col">
  {@render children?.()}
  <ValidationMessages {error} />
</div>
