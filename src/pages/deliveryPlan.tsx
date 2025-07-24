import { useEffect, useState } from "react";
import { DataTable } from "@/components/dataTable";
import { useFetchDeliveryPlan } from "@/hooks/useFetchDeliveryPlan";
import { useUpdatePart } from "@/hooks/useUpdatePart";
import { useCreateDeliveryPlan } from "@/hooks/useCreateDeliveryPlan";
import { useDeletePart } from "@/hooks/useDeletePart";
import { PartFormDialog } from "@/components/partFormDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DeliveryPlan } from "@/types";
import { set } from "zod";

interface Option {
  id: number;
  name: string;
}

export default function DeliveryPlan() {
  const { data: parts, loading, error, fetchData } = useFetchDeliveryPlan();
  const { updatePart, loading: updating, error: updateError } = useUpdatePart();
  const { createDeliveryPlan, loading: creating, error: createError } = useCreateDeliveryPlan();
  const { deletePart, loading: deleting, error: deleteError } = useDeletePart();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editing, setEditing] = useState<DeliveryPlan | null>(null);
  const [creatingDeliveryPlan, setCreatingDeliveryPlan] = useState(false);

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
    { header: "Description", accessor: "part_description" },
    { header: "Comments", accessor: "comment" },
    { header: "To Inspect", accessor: "quantity_to_inspect" },
    { header: "Inspected", accessor: "quantity_inspected" },
    { header: "Rejected", accessor: "quantity_rejected" },
  ] as const;

  const editableFields = [
    "part_number",
    "description",
    "week_number",
    "year",
    "priority_rank",
    "inspection_date",
    "comment",
    "quantity_to_inspect",
    "quantity_inspected",
    "quantity_rejected",
  ] as const;

  if (loading) return <div>Loading...</div>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <>
      {/* Header + Create Button */}
      <div className="flex items-center p-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">Delivery Plan</h1>
          <div
            data-orientation="vertical"
            role="none"
            data-slot="separator"
            className="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px mr-2 data-[orientation=vertical]:h-4"></div>
          <p className="text-muted-foreground mr-20">{parts.length} parts found</p>
        </div>
        <Button
          className="mr-20 cursor-pointer"
          onClick={() => setCreatingDeliveryPlan(true)}>
          + Add to Delivery Plan
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
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

      {/* Add part to Delivery Plan */}
      <PartFormDialog
        open={creatingDeliveryPlan}
        title="Add Part to Delivery Plan"
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
        onOpenChange={(open) => !open && setCreatingDeliveryPlan(false)}
        onSubmit={async (newPart) => {
          await createDeliveryPlan(newPart);
          setCreatingDeliveryPlan(false);
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
