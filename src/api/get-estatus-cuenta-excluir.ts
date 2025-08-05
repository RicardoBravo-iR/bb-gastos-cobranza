// src/api/get-estatus-cuenta-excluir.ts
import { useEffect, useState } from "react";
import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

export interface EstatusCuentaExcluir {
  status_id: string;
  estatusCta: string;
}

// Hook para obtener los estatus de cuenta a excluir; si cambia refreshKey se refetch.
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
        const url = `${API_SAC}cobranzas/statusDontApplyCharge/get`;
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
          console.error("[API] Error llamando al API de estatus de cuenta a excluir:", errorText);
          throw new Error("No se pudo obtener los estatus de cuenta a excluir");
        }

        const result = await response.json();
        console.log("[API] Respuesta del API de estatus de cuenta a excluir:", result);

        let items: EstatusCuentaExcluir[] = [];
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
        console.log("[API] Datos de estatus de cuenta a excluir cargados en el estado:", items);
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
