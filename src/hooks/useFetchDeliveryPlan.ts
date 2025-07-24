import type { DeliveryPlan } from "@/types";
import { useState, useEffect, useCallback } from "react";

export function useFetchDeliveryPlan() {
  const [data, setData] = useState<DeliveryPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("Backend URL is not defined");
  }

  /**
   * Función que hace el fetch. Puede recibir una señal de abort,
   * pero no retorna la función de limpieza.
   */
  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${backendUrl}/delivery/delivery`, signal
          ? { signal }
          : undefined
        );
        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const json = (await res.json()) as DeliveryPlan[];
        setData(json);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    },
    [backendUrl]
  );

  // Efecto que dispara la carga inicial y limpia con controller.abort()
  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => {
      controller.abort();
    };
  }, [fetchData]);

  return { data, loading, error, fetchData };
}
