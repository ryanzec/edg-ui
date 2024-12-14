<script>
  import { dialogUtils } from '$lib/components/core/dialog/utils';
  import PeekContent from '$lib/components/core/peek/peek-content.svelte';
  import PeekFooterAction from '$lib/components/core/peek/peek-footer-action.svelte';
  import PeekFooterCloseAction from '$lib/components/core/peek/peek-footer-close-action.svelte';
  import PeekFooter from '$lib/components/core/peek/peek-footer.svelte';
  import PeekHeader from '$lib/components/core/peek/peek-header.svelte';
  import Peek from '$lib/components/core/peek/peek.svelte';
  import { createDialog, melt } from '@melt-ui/svelte';
  import { writable } from 'svelte/store';

  let peekIsOpened = writable(false);

  const {
    elements: { overlay, content, title, description, close, portalled },
  } = createDialog(dialogUtils.buildCreateOptions(peekIsOpened));
</script>

<button type="button" onclick={() => peekIsOpened.set(true)}>resizable</button>
<Peek isOpened={peekIsOpened} isResizable meltOverlay={overlay} meltPortalled={portalled} meltContent={content}>
  <PeekHeader meltTitle={title} title="My resizable title" meltClose={close} />
  <PeekContent><div use:melt={$description} class="mb-5 mt-2">I am resizable</div></PeekContent>
  <PeekFooter>
    <PeekFooterCloseAction meltClose={close} />
    <PeekFooterAction on:click title="Action" />
  </PeekFooter>
</Peek>
