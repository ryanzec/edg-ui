<script lang="ts">
  import { createDialog, melt } from '@melt-ui/svelte';
  import DialogHeader from '$lib/components/core/dialog/dialog-header.svelte';
  import DialogContent from '$lib/components/core/dialog/dialog-content.svelte';
  import DialogFooter from '$lib/components/core/dialog/dialog-footer.svelte';
  import DialogFooterCloseAction from '$lib/components/core/dialog/dialog-footer-close-action.svelte';
  import DialogFooterAction from '$lib/components/core/dialog/dialog-footer-action.svelte';
  import { writable, type Writable } from 'svelte/store';
  import { dialogUtils } from '$lib/components/core/dialog/utils';
  import Dialog from '$lib/components/core/dialog/dialog.svelte';

  export let isOpened: Writable<boolean> = writable(false);

  const {
    elements: { trigger, overlay, content, title, description, close, portalled },
  } = createDialog(dialogUtils.buildCreateOptions(isOpened));

  const handleAction = () => {
    isOpened.set(false);
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
    <DialogFooterCloseAction meltClose={close} />
    <DialogFooterAction on:click={handleAction} title="Action" />
  </DialogFooter></Dialog
>
