import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from 'lucide-react';

interface Column<T> {
  header: string
  accessor: keyof T
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onEdit?: (row: T) => void
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
}: DataTableProps<T>) {
  return (
    <div className="rounded-lg overflow-hidden border border-zinc-800 ml-10 mr-20">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto whitespace-nowrap divide-y divide-gray-700">
          <thead className="bg-muted">
            <tr>
              {onEdit && (
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground whitespace-nowrap">
                  Actions
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={String(col.accessor)}
                  className="px-6 py-3 text-left text-sm font-medium text-foreground whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {data.map((row) => (
              <tr key={row.id}>

                {onEdit && (
                  <td className="text-center py-4 text-sm whitespace-nowrap">
                    <Button
                      variant="link"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => onEdit(row)}
                    >
                      <Pencil strokeWidth={2.75}/>
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => onEdit(row)}
                    >
                      <Trash2  strokeWidth={2.75}/>
                    </Button>
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={String(col.accessor)}
                    className="px-6 py-4 text-sm whitespace-nowrap"
                  >
                    {String(row[col.accessor])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}