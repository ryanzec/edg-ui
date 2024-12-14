<script lang="ts" generics="TActionOptions">
  import type { HTMLAttributes } from 'svelte/elements';
    /* global TActionOptions */

  import { twMerge } from 'tailwind-merge';


  type Props = HTMLAttributes<HTMLLabelElement> & {
    use?: (element: HTMLLabelElement, options?: TActionOptions) => void;
    useOptions?: TActionOptions | undefined;
    for?: string | undefined;
    class?: string;
    children?: import('svelte').Snippet;
  };

  let {
    use = () => {},
    useOptions = undefined,
    for: forName = undefined,
    class: extraClass = '',
    children,
    ...rest
  }: Props = $props();

</script>

<label use:use={useOptions} for={forName} class={twMerge('inline-block w-full', extraClass)} {...rest}>
  {@render children?.()}
</label>
