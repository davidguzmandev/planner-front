// src/pages/Parts.tsx
import { useEffect, useState } from "react";
import { DataTable } from "@/components/dataTable";
import { useFetchParts } from "@/hooks/useFetchParts";
import { useUpdatePart } from "@/hooks/useUpdatePart";
import { useCreatePart } from "@/hooks/useCreatePart";
import { useDeletePart } from "@/hooks/useDeletePart";
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
  const { deletePart, loading: deleting, error: deleteError } = useDeletePart();

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

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta parte?")) return;
    try {
      await deletePart(id);
      await fetchData();
    } catch {
      /* el error se muestra con deleteError */
    }
  }

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
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">Parts</h1>
          <div
            data-orientation="vertical"
            role="none"
            data-slot="separator"
            className="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px mr-2 data-[orientation=vertical]:h-4"></div>
          <p className="text-muted-foreground">{parts.length} parts found</p>
        </div>
        <Button
          className="mr-20 cursor-pointer font-bold"
          onClick={() => setCreatingPart(true)}>
          +
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={parts}
        onEdit={setEditing}
        onDelete={handleDelete}
      />

      {/* Edit Part Dialog */}
      <PartFormDialog
        open={!!editing}
        title="Edit Part"
        initialData={editing ?? {}}
        editableFields={editableFields}
        selectFields={[
          { name: "project_id", label: "Project", options: projects },
          { name: "product_id", label: "Product", options: products },
          {
            name: "destination_id",
            label: "Destination",
            options: destinations,
          },
        ]}
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
        selectFields={[
          { name: "project_id", label: "Project", options: projects },
          { name: "product_id", label: "Product", options: products },
          {
            name: "destination_id",
            label: "Destination",
            options: destinations,
          },
        ]}
        loading={creating}
        error={createError}
        onOpenChange={(open) => !open && setCreatingPart(false)}
        onSubmit={async (newPart) => {
          await createPart(newPart);
          setCreatingPart(false);
          await fetchData();
        }}
      />
    </>
  );
}
