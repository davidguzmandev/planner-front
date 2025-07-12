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
    { header: "Project ID", accessor: "project_id" },
    { header: "Product ID", accessor: "product_id" },
    { header: "Coefficient", accessor: "coefficient" },
    { header: "Comments", accessor: "comments" },
    { header: "Destination ID", accessor: "destination_id" },
    { header: "Quantity Requested", accessor: "quantity_requested" },
    { header: "Quantity Remaining", accessor: "quantity_remaining" },
    { header: "Created At", accessor: "created_at" },
    { header: "Updated At", accessor: "updated_at" },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Listado de Parts</h1>
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
