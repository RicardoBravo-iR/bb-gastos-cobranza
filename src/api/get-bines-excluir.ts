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
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        let allItems: BinExcluir[] = [];
        let nextPageToken: string | undefined = undefined;
        let hasNextPage = true;
        let previousTokens = new Set<string>();
        let pageCount = 0;
        const MAX_PAGES = 100000;

        while (hasNextPage && pageCount < MAX_PAGES) {
          let url = `${API_SAC}cobranzas/binExcluded/get`;
          if (nextPageToken) {
            url += `?nextPageToken=${encodeURIComponent(nextPageToken)}`;
          }

          console.log(`[API] Llamando a: ${url}`);

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
          const items: BinExcluir[] = result?.data?.items || [];

          if (items.length === 0) {
            console.warn("[API] No se recibieron más items. Rompiendo bucle.");
            break;
          }

          allItems = [...allItems, ...items];

          const pagination = result?.data?.pagination;
          hasNextPage = pagination?.hasNextPage ?? false;
          const newToken = pagination?.nextPageToken;

          if (!newToken || previousTokens.has(newToken)) {
            console.warn("[API] Token repetido o no definido. Rompiendo bucle.");
            break;
          }

          previousTokens.add(newToken);
          nextPageToken = newToken;
          pageCount++;

          console.log(`[API] Página ${pageCount} cargada. Total acumulado: ${allItems.length}`);
        }

        setData(allItems);
        console.log("[API] Todos los bines a excluir cargados correctamente:", allItems.length);
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
