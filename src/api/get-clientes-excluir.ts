// src/api/get-clientes-a-excluir.ts
import { useEffect, useState } from "react";
import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

export interface ClienteAExcluir {
  cliente_id: string;
  fechaVigenciaHasta: string;
  identificacion: string;
}

// Hook para obtener los clientes a excluir; si cambia refreshKey se refetch.
export function getClientesAExcluir(refreshKey: number = 0) {
  const [data, setData] = useState<ClienteAExcluir[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("[API] Iniciando fetch de clientes a excluir...");
        if (!API_SAC) throw new Error("No se ha configurado la URL del API (API_SAC)");

        const token = await getCognitoToken();
        const url = `${API_SAC}cobranzas/clientDontApplyCharge/get`;
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
          console.error("[API] Error llamando al API de clientes a excluir:", errorText);
          throw new Error("No se pudo obtener los clientes a excluir");
        }

        const result = await response.json();
        console.log("[API] Respuesta del API de clientes a excluir:", result);

        let items: ClienteAExcluir[] = [];
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
        console.log("[API] Datos de clientes a excluir cargados en el estado:", items);
      } catch (err: any) {
        console.error("[API] Error en fetchData de clientes a excluir:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log("[API] Finalizó fetch de clientes a excluir.");
      }
    }

    fetchData();
  }, [refreshKey]);

  return { data, loading, error };
}
