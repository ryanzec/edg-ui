<script lang="ts" generics="TActionOptions">
  import { twMerge } from 'tailwind-merge';

  /* global TActionOptions */
  export let use: (element: HTMLLabelElement, options?: TActionOptions) => void = () => {};
  export let useOptions: TActionOptions | undefined = undefined;

  let forName: string | undefined = undefined;
  export { forName as for };

  let extraClass: string = '';
  export { extraClass as class };
</script>

<label use:use={useOptions} for={forName} class={twMerge('inline-block w-full', extraClass)} {...$$restProps}
  ><slot /></label
>
