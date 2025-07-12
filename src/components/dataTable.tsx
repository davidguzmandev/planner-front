interface Column<T> {
  header: string
  accessor: keyof T
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
}

export function DataTable<T>({ columns, data }: DataTableProps<T>) {
  return (
    <div className="overflow-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td
                  key={String(col.accessor)}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {String(row[col.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
