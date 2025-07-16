import { useState } from "react";
import { DataTable } from "@/components/dataTable";
import { useFetchParts } from "@/hooks/useFetchParts";
import { useUpdatePart } from "@/hooks/useUpdatePart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Part } from "@/types";

export default function Parts() {
  const { data: parts, loading, error, fetchData } = useFetchParts();
  const { updatePart, loading: updating, error: updateError } = useUpdatePart();
  const [editing, setEditing] = useState<Part | null>(null);

  // columnas para mostrar en la tabla
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

  // campos editables que realmente existen en la tabla
  const editableFields = [
    "part_number",
    "description",
    "coefficient",
    "comments",
    "quantity_requested",
    "quantity_remaining",
  ] as const;

  if (loading) return <div>Loading...</div>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <>
      <div className="flex items-center gap-2 p-4">
        <h1 className="text-xl font-bold">Parts</h1>
        <div
          data-orientation="vertical"
          role="none"
          data-slot="separator"
          className="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px mx-2 data-[orientation=vertical]:h-4"></div>
          <span className="text-muted-foreground text-sm">{parts.length} parts found</span>
      </div>
      <DataTable columns={columns} data={parts} onEdit={setEditing} />

      {editing && (
        <Dialog open onOpenChange={(open) => !open && setEditing(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Part</DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  ×
                </Button>
              </DialogClose>
            </DialogHeader>

            <form
              className="space-y-4 mt-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updates: Partial<Part> = {};

                // solo campos editables (no project_name, etc)
                editableFields.forEach((field) => {
                  const value = formData.get(field);
                  if (value != null) {
                    // si el valor original es numérico, lo convertimos
                    const orig = (editing as any)[field];
                    updates[field as keyof Part] =
                      typeof orig === "number" ? Number(value) : String(value);
                  }
                });

                try {
                  await updatePart(editing.id, updates);
                  setEditing(null);
                  await fetchData(); // refresca la lista
                } catch {
                  /* el error se muestra con updateError */
                }
              }}>
              {editableFields.map((field) => (
                <div key={field}>
                  <label className="block text-xs font-medium mb-1">
                    {field
                      .split("_")
                      .map((w) => w[0].toUpperCase() + w.slice(1))
                      .join(" ")}
                  </label>
                  <Input
                    name={field}
                    defaultValue={String((editing as any)[field] ?? "")}
                  />
                </div>
              ))}

              {updateError && (
                <p className="text-red-600 text-sm">{updateError}</p>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="submit" disabled={updating}>
                  {updating ? "Saving…" : "Save"}
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
