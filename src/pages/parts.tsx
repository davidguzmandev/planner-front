// src/pages/Parts.tsx
import { useEffect, useState } from "react";
import { DataTable } from "@/components/dataTable";
import { useFetchParts } from "@/hooks/useFetchParts";
import { useUpdatePart } from "@/hooks/useUpdatePart";
import { useCreatePart } from "@/hooks/useCreatePart";
import { PartFormDialog } from "@/components/partFormDialog";
import { Button } from "@/components/ui/button";
import type { Part } from "@/types";

interface Option {
  id: number;
  name: string;
}

export default function Parts() {
  const { data: parts, loading, error, fetchData } = useFetchParts();
  const { updatePart, loading: updating, error: updateError } = useUpdatePart();
  const { createPart, loading: creating, error: createError } = useCreatePart();

  const [editing, setEditing] = useState<Part | null>(null);
  const [creatingPart, setCreatingPart] = useState(false);

  const [projects, setProjects] = useState<Option[]>([]);
  const [products, setProducts] = useState<Option[]>([]);
  const [destinations, setDestinations] = useState<Option[]>([]);

  useEffect(() => {
    async function loadOptions() {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const [pj, pr, dt] = await Promise.all([
        fetch(`${backendUrl}/projects`).then((r) => r.json()),
        fetch(`${backendUrl}/products`).then((r) => r.json()),
        fetch(`${backendUrl}/destinations`).then((r) => r.json()),
      ]);
      setProjects(pj);
      setProducts(pr);
      setDestinations(dt);
    }
    loadOptions();
  }, []);

  const columns = [
    { header: "Part Number", accessor: "part_number" },
    { header: "Description", accessor: "description" },
    { header: "Project", accessor: "project_name" },
    { header: "Product", accessor: "product_name" },
    { header: "Comments", accessor: "comments" },
    { header: "Destination", accessor: "destination_name" },
    { header: "Quantity Requested", accessor: "quantity_requested" },
    { header: "Quantity Remaining", accessor: "quantity_remaining" },
  ] as const;

  const editableFields = [
    "part_number",
    "description",
    "comments",
    "quantity_requested",
    "quantity_remaining",
  ] as const;

  if (loading) return <div>Loading...</div>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <>
      {/* Header + Create Button */}
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">Parts</h1>
        <Button onClick={() => setCreatingPart(true)}>Create Part</Button>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={parts} onEdit={setEditing} />

      {/* Edit Part Dialog */}
      <PartFormDialog
        open={!!editing}
        title="Edit Part"
        initialData={editing ?? {}}
        editableFields={editableFields}
        loading={updating}
        error={updateError}
        onOpenChange={(open) => !open && setEditing(null)}
        onSubmit={async (updates) => {
          if (!editing) return;
          await updatePart(editing.id, updates);
          setEditing(null);
          await fetchData();
        }}
      />

      {/* Create New Part Dialog */}
      <PartFormDialog
        open={creatingPart}
        title="Create New Part"
        initialData={{} as any}
        editableFields={editableFields}
        loading={creating}
        error={createError}
        onOpenChange={(open) => !open && setCreatingPart(false)}
        onSubmit={async (newPart) => {
          // Añade aquí los IDs de proyecto/producto/destino
          await createPart({
            ...newPart,
            project_id: 1,
            product_id: 1,
            destination_id: 1,
          });
          setCreatingPart(false);
          await fetchData();
        }}
      />
    </>
  );
}
