// update-tarifas-generales.ts
import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

export interface TarifaGeneral {
  tarifa_id: string;
  codigoServicioFinanciero: string;
  diasVencidoDesde: string;
  diasVencidoHasta: string;
  montoVencidoDesde: string;
  montoVencidoHasta: string;
  tarifaSinIva: string;
}

/**
 * Actualiza una tarifa de gastos de cobranza existente.
 * Se envía el objeto completo con los valores.
 *
 * @param tarifa - Objeto con los datos de la tarifa a actualizar
 */
export async function updateTarifaGeneral(tarifa: TarifaGeneral): Promise<void> {
  try {
    console.log(`[PATCH] Iniciando actualización de tarifa:`, tarifa);

    const token = await getCognitoToken();
    const url = `${API_SAC}cobranzas/rateCharge/modify`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tarifa),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[PATCH] Error al actualizar la tarifa: ${errorText}`);
      throw new Error("Error al actualizar la tarifa: " + errorText);
    }

    console.log("[PATCH] Tarifa actualizada correctamente.");
  } catch (error: any) {
    console.error("[PATCH] Error en updateTarifaGeneral:", error.message);
    throw error;
  }
}
