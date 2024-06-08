<script lang="ts">
  import XIcon from '$lib/components/core/icons/x-icon.svelte';

  import Button from '$lib/components/core/button/button.svelte';
</script>

<Button><XIcon slot="preItem" />Pre Item</Button>
<Button>Post Item<XIcon slot="postItem" /></Button>
<Button><XIcon slot="preItem" />Pre and Post Item<XIcon slot="postItem" /></Button>
<Button isLoading><XIcon slot="preItem" />Is Loading Hides Items<XIcon slot="postItem" /></Button>
