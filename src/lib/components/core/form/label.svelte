<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type LabelProps<TActionOptions> = HTMLAttributes<HTMLLabelElement> & {
    use?: (element: HTMLLabelElement, options?: TActionOptions) => void;
    useOptions?: TActionOptions | undefined;
    for?: string | undefined;
    class?: string;
    children?: import('svelte').Snippet;
  };
</script>

<script lang="ts" generics="TActionOptions">
  /* global TActionOptions */
  import { tailwindUtils } from '$lib/utils/tailwind';

  let {
    use = () => {},
    useOptions = undefined,
    for: forName = undefined,
    class: extraClass = '',
    children,
    ...rest
  }: LabelProps<TActionOptions> = $props();
</script>

<label use:use={useOptions} for={forName} class={tailwindUtils.merge('inline-block w-full', extraClass)} {...rest}>
  {@render children?.()}
</label>
