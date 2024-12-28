<script lang="ts">
  import ButtonToggle, { type ButtonToggleItemData } from '$lib/components/core/button/button-toggle.svelte';
  import { ButtonColor } from '$lib/components/core/button/button.svelte';

  let activeButtons: string[] = $state(['one']);
  let toggleItems: ButtonToggleItemData[] = [
    {
      id: 'one',
      display: 'O',
    },
    {
      id: 'two',
      icon: 'align-justified',
    },
    {
      id: 'three',
      display: 'T',
    },
  ];
</script>

<div class="gap-xs flex flex-col">
  <ButtonToggle bind:activeButtons items={toggleItems} />
  <ButtonToggle bind:activeButtons items={toggleItems} color={ButtonColor.NEUTRAL} />
</div>
