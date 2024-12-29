<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type FormFieldsProps = HTMLAttributes<HTMLDivElement> & { children?: import('svelte').Snippet };
</script>

<script lang="ts">
  import { tailwindUtils } from '$lib/utils/tailwind';

  let { children, class: extraClass = '', ...rest }: FormFieldsProps = $props();
</script>

<div class={tailwindUtils.merge('gap-2xs flex flex-col', extraClass)} {...rest}>
  {@render children?.()}
</div>
