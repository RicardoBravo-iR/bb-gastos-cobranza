// src/api/get-parametros-generales.ts
import { useEffect, useState } from "react";
import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

export interface ParametroGeneral {
  parametro: string;
  valor: string;
}

export function getParametrosGenerales(refreshKey: number = 0) {
  const [data, setData] = useState<ParametroGeneral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("[API] Iniciando fetch de parámetros generales...");
        if (!API_SAC) throw new Error("No se ha configurado la URL del API (API_SAC)");

        const token = await getCognitoToken();
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        let allItems: ParametroGeneral[] = [];
        let nextPageToken: string | undefined = undefined;
        let hasNextPage = true;
        let previousTokens = new Set<string>();
        let pageCount = 0;
        const MAX_PAGES = 100000;

        while (hasNextPage && pageCount < MAX_PAGES) {
          let url = `${API_SAC}cobranzas/parameterCharge/get`;
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
            console.error("[API] Error llamando al API:", errorText);
            throw new Error("No se pudo obtener los parámetros");
          }

          const result = await response.json();
          const items: ParametroGeneral[] = result?.data?.items || [];

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
        console.log("[API] Todos los parámetros cargados correctamente:", allItems.length);
      } catch (err: any) {
        console.error("[API] Error en fetchData:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log("[API] Finalizó fetch de parámetros generales.");
      }
    }

    fetchData();
  }, [refreshKey]);

  return { data, loading, error };
}
