<script lang="ts">
  import Table from '$lib/components/core/table/table.svelte';
  import TableRow from '$lib/components/core/table/table-row.svelte';
  import TableData from '$lib/components/core/table/table-data.svelte';
  import TableHeader from '$lib/components/core/table/table-header.svelte';

  let tableData = [];

  for (let i = 0; i < 500; i++) {
    tableData.push({
      name: 'John Doe',
      email: '2e5wF@example.com',
      role: 'Admin',
    });
  }
</script>

<div>
  <div>Header / Footer</div>
  <div class="gap-sm flex w-[700px] flex-col">
    <Table>
      {#snippet tableHead()}
        <TableRow>
          <TableHeader class="w-[200px]">Name</TableHeader>
          <TableHeader class="text-right">Email</TableHeader>
          <TableHeader>Role</TableHeader>
        </TableRow>
      {/snippet}
      {#each tableData as row}
        <TableRow>
          <TableData>{row.name}</TableData>
          <TableData class="text-right">{row.email}</TableData>
          <TableData>{row.role}</TableData>
        </TableRow>
      {/each}
      {#snippet footer()}
        Footer Content
      {/snippet}
    </Table>
  </div>
</div>
