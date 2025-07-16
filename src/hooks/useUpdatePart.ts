import { useState } from "react"
import type { Part } from "@/types";

export function useUpdatePart() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  if (!backendUrl) throw new Error("Backend URL is not defined")

  async function updatePart(id: string, updates: Record<string, any>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/part/parts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || res.statusText)
      }
      return (await res.json()) as Part
    } catch (e: any) {
      setError(e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { updatePart, loading, error }
}
