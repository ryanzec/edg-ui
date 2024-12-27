<script lang="ts">
  import Overlay from '$lib/components/core/overlay/overlay.svelte';
  import Callout, { CalloutColor, CalloutVariant } from '$lib/components/core/callout/callout.svelte';
  import LoaderIcon from '$lib/components/core/loader/loader-icon.svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { tailwindUtils } from '$lib/utils/tailwind';

  type Props = HTMLAttributes<HTMLDivElement> & {
    isActive: boolean;
    isFixed?: boolean;
  };

  let { isActive, class: extraClass = '', isFixed = true, ...rest }: Props = $props();
</script>

{#if isActive}
  <div {...rest}>
    <Overlay {isFixed} />
    <Callout
      color={CalloutColor.BRAND}
      variant={CalloutVariant.FILLED}
      class={tailwindUtils.merge('z-over-overlay top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', extraClass, {
        fixed: isFixed,
        absolute: !isFixed,
      })}
    >
      {#snippet preItem()}
        <LoaderIcon />
      {/snippet}
      Loading
    </Callout>
  </div>
{/if}
