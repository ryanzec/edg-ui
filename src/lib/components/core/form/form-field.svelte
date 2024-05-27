<script lang="ts">
  import ValidationMessages from '$lib/components/core/form/validation-messages.svelte';
  import type { WithFormFieldErrors } from '$lib/stores/form-manager.store';

  export let error: WithFormFieldErrors | undefined = undefined;
</script>

<div data-id="form-field" {...$$restProps} class="gap-label flex flex-col">
  <slot />
  <ValidationMessages {error} />
</div>
