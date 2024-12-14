<script lang="ts" generics="TFormData">
  import type { WithFormFieldErrors } from '$lib/stores/form-manager.store';

  type Props = { error: WithFormFieldErrors | undefined };

  let { error }: Props = $props();
</script>

{#if error?.errors && error.errors.length > 0}
  <div data-id="validation-messages" class="text-danger">
    {#each error.errors as errorMessage}
      <div data-id="message">{errorMessage}</div>
    {/each}
  </div>
{/if}
