<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLDivElement> & {
    label?: string;
    src?: string;
    count?: number;
  };

  let { label, src, count = 0, ...rest }: Props = $props();

  let labelText = label;

  if (count > 0) {
    labelText = `+${count > 99 ? '99' : count}`;
  }
</script>

<div {...rest} class="bg-brand text-surface-on-inverse h-[40px] w-[40px] overflow-hidden rounded-full border">
  {#if src}
    <img class="h-full w-full object-cover" {src} alt={label} />
  {:else}
    <span class="flex h-full w-full items-center justify-center">{labelText}</span>
  {/if}
</div>
