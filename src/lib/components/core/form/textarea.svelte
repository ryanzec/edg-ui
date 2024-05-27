<script lang="ts">
  export let value: string = '';
  export let name: string;
  export let id: string = name;
</script>

<textarea
  autocomplete="off"
  {...$$restProps}
  {id}
  {name}
  class="p-input rounded border border-outline bg-input-background px-2 outline-none hover:border-outline-active focus:border-outline-active"
  bind:value
/>
