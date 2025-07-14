interface Column<T> {
  header: string;
  accessor: keyof T;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export function DataTable<T>({ columns, data }: DataTableProps<T>) {
  return (
    <div className="rounded-lg overflow-hidden border border-zinc-800">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto whitespace-nowrap divide-y divide-gray-700">
          <thead className="bg-muted">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.accessor)}
                  className="px-6 py-3 text-left text-sm text-foreground align-middle font-medium whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y border-zinc-800">
            {data.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td
                    key={String(col.accessor)}
                    className="px-6 py-4 whitespace-nowrap text-sm">
                    {String(row[col.accessor])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
