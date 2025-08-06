// src/api/get-estatus-cuenta-excluir.ts
import { useEffect, useState } from "react";
import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

export interface EstatusCuentaExcluir {
  status_id: string;
  estatusCta: string;
}

export function getEstatusCuentaExcluir(refreshKey: number = 0) {
  const [data, setData] = useState<EstatusCuentaExcluir[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("[API] Iniciando fetch de estatus de cuenta a excluir...");
        if (!API_SAC) throw new Error("No se ha configurado la URL del API (API_SAC)");

        const token = await getCognitoToken();
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        let allItems: EstatusCuentaExcluir[] = [];
        let nextPageToken: string | undefined = undefined;
        let hasNextPage = true;
        let previousTokens = new Set<string>();
        let pageCount = 0;
        const MAX_PAGES = 100000;

        while (hasNextPage && pageCount < MAX_PAGES) {
          let url = `${API_SAC}cobranzas/statusDontApplyCharge/get`;
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
            console.error("[API] Error llamando al API de estatus de cuenta a excluir:", errorText);
            throw new Error("No se pudo obtener los estatus de cuenta a excluir");
          }

          const result = await response.json();
          const items: EstatusCuentaExcluir[] = result?.data?.items || [];

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
        console.log("[API] Todos los estatus cargados correctamente:", allItems.length);
      } catch (err: any) {
        console.error("[API] Error en fetchData de estatus de cuenta a excluir:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log("[API] Finalizó fetch de estatus de cuenta a excluir.");
      }
    }

    fetchData();
  }, [refreshKey]);

  return { data, loading, error };
}
