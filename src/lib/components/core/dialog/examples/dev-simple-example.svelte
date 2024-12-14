<script lang="ts">
  import { createDialog, melt } from '@melt-ui/svelte';
  import DialogHeader from '$lib/components/core/dialog/dialog-header.svelte';
  import DialogContent from '$lib/components/core/dialog/dialog-content.svelte';
  import DialogFooter from '$lib/components/core/dialog/dialog-footer.svelte';
  import { writable, type Writable } from 'svelte/store';
  import { dialogUtils } from '$lib/components/core/dialog/utils';
  import Dialog from '$lib/components/core/dialog/dialog.svelte';
  import Button, { ButtonColor, ButtonVariant } from '$lib/components/core/button/button.svelte';

  interface Props {
    isOpened?: Writable<boolean>;
  }

  let { isOpened = writable(false) }: Props = $props();

  const {
    elements: { trigger, overlay, content, title, description, close, portalled },
  } = createDialog(dialogUtils.buildCreateOptions(isOpened));

  const handleAction = () => {
    $isOpened = false;
  };
</script>

<button
  use:melt={$trigger}
  class="inline-flex items-center justify-center rounded-xl px-4 py-3 font-medium leading-none shadow"
>
  Open Dialog
</button>

<Dialog meltContent={content} meltOverlay={overlay} meltPortalled={portalled} {isOpened}>
  <DialogHeader meltTitle={title} title="Edit profile" meltClose={close} />
  <DialogContent>
    <p use:melt={$description} class="">Make changes to your profile here. Click save when you're done.</p>
    <fieldset>
      <label for="name">Name</label>
      <input id="name" value="Thomas G. Lopes" />
    </fieldset>
    <fieldset>
      <label for="username">Username</label>
      <input id="username" value="@thomasglopes" />
    </fieldset>
  </DialogContent>
  <DialogFooter>
    <Button onclick={handleAction} color={ButtonColor.NEUTRAL} variant={ButtonVariant.GHOST}>Close</Button>
    <Button onclick={handleAction}>Action</Button>
  </DialogFooter></Dialog
>
