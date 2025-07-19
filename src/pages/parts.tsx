import { useEffect, useState } from "react";
import { DeliveryTable } from "@/components/deliveryTable";
import { useFetchParts } from "@/hooks/useFetchParts";
import { useUpdatePart } from "@/hooks/useUpdatePart";
import { useCreatePart } from "@/hooks/useCreatePart";
import { useDeletePart } from "@/hooks/useDeletePart";
import { PartFormDialog } from "@/components/partFormDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Part } from "@/types";
import { set } from "zod";

interface Option {
  id: number;
  name: string;
}

export default function Parts() {
  const { data: parts, loading, error, fetchData } = useFetchParts();
  const { updatePart, loading: updating, error: updateError } = useUpdatePart();
  const { createPart, loading: creating, error: createError } = useCreatePart();
  const { deletePart, loading: deleting, error: deleteError } = useDeletePart();
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  async function handleDelete() {
    if (!deletingId) return;
    try {
      await deletePart(deletingId);
      setDeletingId(null);
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
      <div className="flex items-center p-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">Parts</h1>
          <div
            data-orientation="vertical"
            role="none"
            data-slot="separator"
            className="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px mr-2 data-[orientation=vertical]:h-4"></div>
          <p className="text-muted-foreground mr-20">{parts.length} parts found</p>
        </div>
        <Button
          className="mr-20 cursor-pointer"
          onClick={() => setCreatingPart(true)}>
          + Create New Part
        </Button>
      </div>

      {/* Data Table */}
      <DeliveryTable
        columns={columns}
        data={parts}
        onEdit={setEditing}
        onDelete={setDeletingId}
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

      {deleteError && (
        <p className="text-red-600 text-sm mt-2">{deleteError}</p>
      )}

      <Dialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="mt-2">Are you sure you want to delete this part?</p>
          {deleteError && (
            <p className="text-red-600 text-sm mt-2">{deleteError}</p>
          )}
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setDeletingId(null)}
              disabled={deleting}
              className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="cursor-pointer">
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
