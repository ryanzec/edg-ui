<script lang="ts" generics="TOptionValue extends { display: string; value: string; }">
  /* global TOptionValue */
  import type { ComboboxStore } from '$lib/components/core/combobox/store';

  type Props = {
    option: TOptionValue;
    optionIndex: number;
    optionAction: ComboboxStore<TOptionValue>['optionAction'];
    onclick?: (event: Event) => void;
  };

  let { option, optionIndex, optionAction, onclick }: Props = $props();
</script>

<li
  data-id="option"
  use:optionAction={{
    option,
    optionIndex,
  }}
  class="data-combobox-drop-down-selected:bg-brand-subtle data-combobox-highlighted:bg-surface-tertiary relative flex cursor-pointer scroll-my-2 items-center gap-2 px-2 py-1 last:rounded-b-none data-disabled:opacity-50"
>
  <div>
    <span class="font-medium">{option.display}</span>
    <a
      href="http://www.goggle.com"
      target="_blank"
      rel="noreferrer"
      onclick={(event: Event) => {
        event.stopPropagation();
        onclick?.(event);
      }}
    >
      Link
    </a>
  </div>
</li>
