// src/api/get-bines-excluir.ts
import { useEffect, useState } from "react";
import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

export interface BinExcluir {
  bin_id: string;
  bin: string;
}

// Hook para obtener los bines a excluir; si cambia refreshKey se refetch.
export function getBinesExcluir(refreshKey: number = 0) {
  const [data, setData] = useState<BinExcluir[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("[API] Iniciando fetch de bines a excluir...");
        if (!API_SAC) throw new Error("No se ha configurado la URL del API (API_SAC)");

        const token = await getCognitoToken();
        const url = `${API_SAC}cobranzas/binExcluded/get`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        console.log("[API] URL a consumir:", url);
        console.log("[API] Headers enviados:", headers);

        const response = await fetch(url, {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("[API] Error llamando al API de bines a excluir:", errorText);
          throw new Error("No se pudo obtener los bines a excluir");
        }

        const result = await response.json();
        console.log("[API] Respuesta del API de bines a excluir:", result);

        let items: BinExcluir[] = [];
        if (Array.isArray(result)) {
          items = result;
        } else if (Array.isArray(result.items)) {
          items = result.items;
        } else if (Array.isArray(result.data?.items)) {
          items = result.data.items;
        } else if (Array.isArray(result.data)) {
          items = result.data;
        }

        setData(items);
        console.log("[API] Datos de bines a excluir cargados en el estado:", items);
      } catch (err: any) {
        console.error("[API] Error en fetchData de bines a excluir:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log("[API] Finalizó fetch de bines a excluir.");
      }
    }

    fetchData();
  }, [refreshKey]);

  return { data, loading, error };
}
