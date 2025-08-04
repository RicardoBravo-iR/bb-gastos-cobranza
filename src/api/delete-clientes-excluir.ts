// delete-tarifas-generales.ts
import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

export interface TarifaGeneral {
  cliente_id: string;
  fechaVigenciaHasta: string;
  identificacion: string;
}

/**
 * Elimina una tarifa de gastos de cobranza enviando solo el id.
 * @param id - Identificador de la tarifa a eliminar
 */
export async function deleteClienteAExcluir(cliente_id: string): Promise<void> {
  try {
    const token = await getCognitoToken();
    const url = `${API_SAC}cobranzas/clientDontApplyCharge/delete`;
    console.log("[DELETE] Token usado:", token);
    console.log("[DELETE] Payload de eliminación: ", { cliente_id });

    const response = await fetch(url, {
      method: "PATCH", // como tu backend espera PATCH para eliminar
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cliente_id }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Error al eliminar la tarifa: " + errorText);
    }

    console.log("[DELETE] Tarifa eliminada correctamente.");
  } catch (error: any) {
    console.error("[DELETE] Error al eliminar la tarifa:", error.message);
    throw error;
  }
}