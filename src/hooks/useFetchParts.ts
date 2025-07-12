import type { Part } from "@/types";
import { useState, useEffect } from "react";

export function useFetchParts() {
  const [data, setData] = useState<Part[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("Backend URL is not defined");
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchParts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${backendUrl}/part/parts`, { signal });
        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const json = (await res.json()) as Part[];
        setData(json);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          setError(error.message || "An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchParts();
    return () => {
      controller.abort(); // Cleanup function to abort fetch on unmount
    };
  }, []);
  return { data, loading, error };
}
