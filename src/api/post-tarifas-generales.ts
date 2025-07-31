import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

export interface TarifaGeneral {
  codigoServicioFinanciero: string;
  diasVencidoDesde: string;
  diasVencidoHasta: string;
  montoVencidoDesde: string;
  montoVencidoHasta: string;
  tarifaSinIva: string;
}

export async function postTarifaGeneral(tarifa_id: string, codigoServicioFinanciero: string, diasVencidoDesde: string,
  diasVencidoHasta: string, montoVencidoDesde: string, montoVencidoHasta: string, 
tarifaSinIva: string): Promise<void> {
  try {
    const token = await getCognitoToken();

    const url = `${API_SAC}cobranzas/rateCharge/register`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({tarifa_id, codigoServicioFinanciero, diasVencidoDesde, diasVencidoHasta, 
        montoVencidoDesde, montoVencidoHasta, tarifaSinIva}),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[POST TARIFA] Error en la respuesta del API:", errorText);
      throw new Error("Error al guardar la tarifa: " + errorText);
    }

    console.log("[POST TARIFA] Tarifa creada correctamente.");
  } catch (error: any) {
    console.error("[POST TARIFA] Error:", error.message);
    throw error;
  }
}
