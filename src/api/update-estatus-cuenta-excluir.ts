// update-estatus-cuenta-excluir.ts
import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

export interface EstatusCuentaAExcluir {
  status_id: string;
  estatusCta: string;
}

/**
 * Actualiza un estatus de cuenta a excluir existente.
 * Se envía el objeto completo con los valores actualizados.
 *
 * @param estatus - Objeto con los datos del estatus a actualizar
 */
export async function updateEstatusCuentaAExcluir(estatus: EstatusCuentaAExcluir): Promise<void> {
  try {
    console.log("[PATCH] Iniciando actualización de estatus de cuenta:", estatus);

    const token = await getCognitoToken();
    const url = `${API_SAC}cobranzas/statusDontApplyCharge/modify`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(estatus),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[PATCH] Error al actualizar el estatus de cuenta:", errorText);
      throw new Error("Error al actualizar el estatus de cuenta: " + errorText);
    }

    console.log("[PATCH] Estatus de cuenta excluido actualizado correctamente.");
  } catch (error: any) {
    console.error("[PATCH] Error en updateEstatusCuentaAExcluir:", error.message);
    throw error;
  }
}
