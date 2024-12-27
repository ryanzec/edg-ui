<script module lang="ts">
  export enum DropDownMenuType {
    MAIN = 'main',
    SUB = 'sub',
  }
</script>

<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import { type Writable } from 'svelte/store';
  import type { WithGet } from '@melt-ui/svelte/internal/helpers';
  import type { HTMLAttributes } from 'svelte/elements';
  import { tailwindUtils } from '$lib/utils/tailwind';

  type Props = HTMLAttributes<HTMLDivElement> & {
    meltMenu: AnyMeltElement;
    isOpened: WithGet<Writable<boolean>>;
    type?: DropDownMenuType;
    children?: import('svelte').Snippet;
  };

  let { meltMenu, isOpened, type = DropDownMenuType.MAIN, children, ...rest }: Props = $props();
</script>

{#if $isOpened}
  <div
    data-id="menu"
    class={tailwindUtils.merge(
      'border-outline bg-surface-pure z-drop-down rounded-base flex min-w-[220px] flex-col border ring-0 shadow-sm',
      {
        'shadow-lg': type === DropDownMenuType.MAIN,
        'shadow-md': type === DropDownMenuType.SUB,
      },
    )}
    use:melt={$meltMenu}
    {...rest}
  >
    {@render children?.()}
  </div>
{/if}
