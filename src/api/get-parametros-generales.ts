import { useEffect, useState } from "react";
import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

export interface ParametroGeneral {
  parametro: string;
  valor: string;
}

export function getParametrosGenerales() {
  const [data, setData] = useState<ParametroGeneral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("[API] Iniciando fetch de parámetros generales...");
        if (!API_SAC) throw new Error("No se ha configurado la URL del API (API_SAC)");

        const token = await getCognitoToken();
        const url = `${API_SAC}cobranzas/parameterCharge/get`;
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
          console.error("[API] Error llamando al API:", errorText);
          throw new Error("No se pudo obtener los parámetros");
        }

        const result = await response.json();
        console.log("[API] Respuesta del API:", result);

        let items: ParametroGeneral[] = [];
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
        console.log("[API] Datos cargados en el estado:", items);
      } catch (err: any) {
        console.error("[API] Error en fetchData:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log("[API] Finalizó fetch de parámetros generales.");
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}
