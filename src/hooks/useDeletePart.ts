import { useState } from "react"
import type { Part } from "@/types";

export function useDeletePart() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  if (!backendUrl) throw new Error("Backend URL is not defined")

  async function deletePart(id: string): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/part/parts/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || res.statusText)
      }
    } catch (e: any) {
      setError(e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { deletePart, loading, error }
}
