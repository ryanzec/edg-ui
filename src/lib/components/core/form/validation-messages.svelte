<script lang="ts" generics="TFormData">
  import type { WithFormFieldErrors } from '$lib/stores/form-manager.store';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLDivElement> & { error: WithFormFieldErrors | undefined };

  let { error, ...rest }: Props = $props();
</script>

{#if error?.errors && error.errors.length > 0}
  <div data-id="validation-messages" class="text-danger" {...rest}>
    {#each error.errors as errorMessage}
      <div data-id="message">{errorMessage}</div>
    {/each}
  </div>
{/if}
