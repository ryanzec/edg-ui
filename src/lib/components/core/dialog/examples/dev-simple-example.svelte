<script lang="ts">
  import { createDialog, melt } from '@melt-ui/svelte';
  import DialogHeader from '$lib/components/core/dialog/dialog-header.svelte';
  import DialogContent from '$lib/components/core/dialog/dialog-content.svelte';
  import DialogFooter from '$lib/components/core/dialog/dialog-footer.svelte';
  import { writable, type Writable } from 'svelte/store';
  import { dialogUtils } from '$lib/components/core/dialog/utils';
  import Dialog from '$lib/components/core/dialog/dialog.svelte';
  import Button, { ButtonColor, ButtonVariant } from '$lib/components/core/button/button.svelte';
  import TextInput from '$lib/components/core/form/text-input.svelte';
  import FormField from '$lib/components/core/form/form-field.svelte';
  import Label from '$lib/components/core/form/label.svelte';

  let isOpened: Writable<boolean> = writable(false);

  const {
    elements: { overlay, content, title, description, close, portalled },
  } = createDialog(dialogUtils.buildCreateOptions(isOpened));

  const handleAction = () => {
    $isOpened = false;
  };

  let value1: Writable<string> = writable('Thomas G. Lopes');
  let value2: Writable<string> = writable('@thomasglopes');
</script>

<Button onclick={() => ($isOpened = true)}>Open Dialog</Button>

<Dialog meltContent={content} meltOverlay={overlay} meltPortalled={portalled} {isOpened}>
  <DialogHeader meltTitle={title} title="Edit profile" meltClose={close} />
  <DialogContent>
    <p use:melt={$description}>Make changes to your profile here. Click save when you're done.</p>
    <FormField data-id="text">
      <Label for="text">Name</Label>
      <TextInput bind:value={$value1} name="text" />
    </FormField>
    <FormField data-id="text">
      <Label for="text">Username</Label>
      <TextInput bind:value={$value2} name="text" />
    </FormField>
  </DialogContent>
  <DialogFooter>
    <Button onclick={handleAction} color={ButtonColor.NEUTRAL} variant={ButtonVariant.GHOST}>Close</Button>
    <Button onclick={handleAction}>Action</Button>
  </DialogFooter>
</Dialog>
