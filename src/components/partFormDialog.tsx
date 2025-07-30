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

interface SelectField {
  name: keyof Omit<Part, "id" | "created_at" | "updated_at">;
  label: string;
  options: { id: number; name: string }[];
}

interface PartFormDialogProps {
  open: boolean;
  title: string;
  initialData?: Partial<Part>;
  editableFields: readonly (keyof Omit<
    Part,
    "id" | "created_at" | "updated_at"
  >)[];
  selectFields?: SelectField[];
  loading: boolean;
  error: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: Omit<Part, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
}

export function PartFormDialog({
  open,
  title,
  initialData = {},
  editableFields,
  loading,
  error,
  onOpenChange,
  onSubmit,
}: PartFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4 mt-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            // Build payload from selects + inputs
            const payload = {} as any;

            // then inputs
            editableFields.forEach((field) => {
              const raw = formData.get(field as string);
              if (raw != null) {
                const orig = initialData[field];
                payload[field] =
                  typeof orig === "number" ? Number(raw) : String(raw);
              }
            });

            try {
              await onSubmit(payload);
            } catch {
              // error shown via `error` prop
            }
          }}>

          {/* Render text/number inputs */}
          {editableFields.map((field) => (
            <div key={String(field)}>
              <label className="block text-xs font-medium mb-1">
                {String(field)
                  .split("_")
                  .map((w) => w[0].toUpperCase() + w.slice(1))
                  .join(" ")}
              </label>
              <Input
                name={String(field)}
                defaultValue={
                  initialData[field] != null ? String(initialData[field]) : ""
                }
              />
            </div>
          ))}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex justify-end space-x-2 pt-4">
            <Button className="cursor-pointer" type="submit" disabled={loading}>
              {loading ? `${title.split(" ")[0]}ing…` : title.split(" ")[0]}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">Cancel</Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
