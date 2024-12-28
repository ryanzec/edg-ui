<script module lang="ts">
  import type { IconName } from '$lib/components/core/icons/utils';
  import type { ButtonProps } from '$lib/components/core/button/button.svelte';

  export type ButtonToggleItemData = {
    id: string;
    display?: string;
    icon?: IconName;
    buttonProps?: ButtonProps;
  };
</script>

<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { setContext } from 'svelte';
  import Button, {
    BUTTON_CONTEXT_KEY,
    ButtonColor,
    ButtonShape,
    type ButtonContext,
    ButtonVariant,
  } from '$lib/components/core/button/button.svelte';
  import { tailwindUtils } from '$lib/utils/tailwind';
  import { loggerUtils } from '$lib/utils/logger';
  import Icon from '$lib/components/core/icons/icon.svelte';

  type Props = HTMLAttributes<HTMLButtonElement> & {
    activeButtons: string[];
    items: ButtonToggleItemData[];
    color?: ButtonColor;
  };

  let { activeButtons = $bindable(), items, color, class: extraClass = '', ...rest }: Props = $props();

  const handleClick = (event: MouseEvent) => {
    const element = event.target as HTMLButtonElement;

    if (element?.tagName !== 'BUTTON') {
      loggerUtils.warn('elements in the button toggle need to be a button, {element.tagName} element type found');

      return;
    }

    const buttonId = element.dataset.buttonId;

    if (!buttonId) {
      loggerUtils.warn('buttons in a button toggle need to have a data-button-id attribute');

      return;
    }

    const isActive = activeButtons.includes(buttonId);

    if (isActive) {
      activeButtons = activeButtons.filter((id) => id !== buttonId);

      return;
    }

    activeButtons = [...activeButtons, buttonId];
  };

  setContext<ButtonContext>(BUTTON_CONTEXT_KEY, {
    variant: ButtonVariant.OUTLINED,
    color: color || ButtonColor.BRAND,
    shape: ButtonShape.ROUNDED,
  });
</script>

<button class={tailwindUtils.merge('button-toggle flex items-stretch', extraClass)} {...rest} onclick={handleClick}>
  {#each items as item}
    <Button data-button-id={item.id} isActive={activeButtons.includes(item.id)} {...item.buttonProps}>
      {#if item.display}{item.display}{/if}
      {#if item.icon}<Icon icon={item.icon} />{/if}
    </Button>
  {/each}
</button>
