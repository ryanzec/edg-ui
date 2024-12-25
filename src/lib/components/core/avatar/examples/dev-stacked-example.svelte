<script lang="ts">
  import Avatar from '$lib/components/core/avatar/avatar.svelte';
  import AvatarStack from '$lib/components/core/avatar/avatar-stack.svelte';
</script>

<AvatarStack>
  <Avatar count={23} />
  <Avatar label="TU" />
  <Avatar src="https://avatars.githubusercontent.com/u/444206?v=4" />
  <Avatar label="TU" />
  <Avatar label="TU" />
  <Avatar src="https://avatars.githubusercontent.com/u/444206?v=4" />
</AvatarStack>
