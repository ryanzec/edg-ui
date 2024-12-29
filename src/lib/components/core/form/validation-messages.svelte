<script module lang="ts">
  import type { WithFormFieldErrors } from '$lib/stores/form-manager.store';
  import type { HTMLAttributes } from 'svelte/elements';

  export type ValidationMessagesProps = HTMLAttributes<HTMLDivElement> & { error: WithFormFieldErrors | undefined };
</script>

<script lang="ts">
  let { error, ...rest }: ValidationMessagesProps = $props();
</script>

{#if error?.errors && error.errors.length > 0}
  <div data-id="validation-messages" class="text-danger" {...rest}>
    {#each error.errors as errorMessage}
      <div data-id="message">{errorMessage}</div>
    {/each}
  </div>
{/if}
