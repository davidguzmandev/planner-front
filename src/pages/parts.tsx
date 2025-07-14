import { DataTableParts } from "@/components/data-table-parts";
import { SidebarInset } from "@/components/ui/sidebar";
import { DataTable } from "@/components/dataTable";
import { useFetchParts } from "@/hooks/useFetchParts";
import data from "@/data/data.json";

export default function Parts() {
  const { data: parts, loading, error } = useFetchParts();

  const columns = [
    { header: "Part Number", accessor: "part_number" },
    { header: "Description", accessor: "description" },
    { header: "Project", accessor: "project_name" },
    { header: "Product", accessor: "product_name" },
    { header: "Comments", accessor: "comments" },
    { header: "Destination", accessor: "destination_name" },
    { header: "Quantity Requested", accessor: "quantity_requested" },
    { header: "Quantity Remaining", accessor: "quantity_remaining" },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Parts List</h1>
        <DataTable columns={columns} data={parts} />
      </div>

      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DataTableParts data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
