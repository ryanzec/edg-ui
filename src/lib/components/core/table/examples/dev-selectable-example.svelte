<script lang="ts">
  import Table from '$lib/components/core/table/table.svelte';
  import TableRow from '$lib/components/core/table/table-row.svelte';
  import TableData from '$lib/components/core/table/table-data.svelte';
  import TableHeader from '$lib/components/core/table/table-header.svelte';

  let tableData = [];
  let selectedRowIds: string[] = $state([]);

  for (let i = 0; i < 5; i++) {
    tableData.push({
      id: `${i}`,
      name: 'John Doe',
      email: '2e5wF@example.com',
      role: 'Admin',
    });
  }

  const handleSelected = (id: string) => {
    console.log(id);
    const isSelected = selectedRowIds.includes(id);

    if (isSelected) {
      selectedRowIds = selectedRowIds.filter((rowId) => rowId !== id);

      return;
    }

    selectedRowIds = [...selectedRowIds, id];
  };
</script>

<div class="gap-sm flex w-[700px] flex-col">
  <div>
    <div>Header / Footer</div>
    <Table>
      {#snippet tableHead()}
        <TableRow>
          <TableHeader></TableHeader>
          <TableHeader class="w-[200px]">Name</TableHeader>
          <TableHeader class="text-right">Email</TableHeader>
          <TableHeader>Role</TableHeader>
        </TableRow>
      {/snippet}
      {#each tableData as row}
        <TableRow isSelectable isSelected={selectedRowIds.includes(row.id)} id={row.id} onSelected={handleSelected}>
          <TableData>{row.name}</TableData>
          <TableData class="text-right">{row.email}</TableData>
          <TableData>{row.role}</TableData>
        </TableRow>
      {/each}
    </Table>
  </div>
</div>

<ul>
  {#each selectedRowIds as id}
    <li>{id}</li>
  {/each}
</ul>
