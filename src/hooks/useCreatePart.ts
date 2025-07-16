import type { Part } from "@/types";
import { useState } from "react";

export function useCreatePart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("Backend URL is not defined");
  }

  async function createPart(
    newPart: Omit<Part, "id" | "created_at" | "updated_at">
  ): Promise<Part> {
    setLoading(true);
    setError(null);
    const res = await fetch(`${backendUrl}/part/parts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPart),
    });
    if (!res.ok) {
      // asignamos el mensaje de error
      const text = await res.text();
      setLoading(false);
      throw new Error(text);
    }
    const json = (await res.json()) as { message: string; part: Part };
    setLoading(false);
    return json.part;
  }

  return { createPart, loading, error };
}
