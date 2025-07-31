// src/api/get-tarifas-generales.ts
import { useEffect, useState } from "react";
import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

export interface TarifaGeneral {
  codigoServicioFinanciero: string;
  diasVencidoDesde: number;
  diasVencidoHasta: number;
  montoVencidoDesde: number;
  montoVencidoHasta: number;
  tarifaSinIva: number;
}

// Hook para obtener las tarifas generales; si cambia refreshKey se refetch.
export function getTarifasGenerales(refreshKey: number = 0) {
  const [data, setData] = useState<TarifaGeneral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("[API] Iniciando fetch de tarifas generales...");
        if (!API_SAC) throw new Error("No se ha configurado la URL del API (API_SAC)");

        const token = await getCognitoToken();
        const url = `${API_SAC}cobranzas/rateCharge/get`;
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
          console.error("[API] Error llamando al API de tarifas:", errorText);
          throw new Error("No se pudo obtener las tarifas generales");
        }

        const result = await response.json();
        console.log("[API] Respuesta del API de tarifas:", result);

        let items: TarifaGeneral[] = [];
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
        console.log("[API] Datos de tarifas cargados en el estado:", items);
      } catch (err: any) {
        console.error("[API] Error en fetchData de tarifas:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log("[API] Finalizó fetch de tarifas generales.");
      }
    }

    fetchData();
  }, [refreshKey]);

  return { data, loading, error };
}
