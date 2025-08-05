// delete-estatus-cuenta-excluir.ts
import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

/**
 * Elimina un estatus de cuenta a excluir enviando solo su ID.
 * @param status_id - Identificador del estatus a eliminar
 */
export async function deleteEstatusCuentaAExcluir(status_id: string): Promise<void> {
  try {
    const token = await getCognitoToken();
    const url = `${API_SAC}cobranzas/statusDontApplyCharge/delete`;

    console.log("[DELETE] Token usado:", token);
    console.log("[DELETE] Payload de eliminación:", { status_id });

    const response = await fetch(url, {
      method: "PATCH", // asumimos que el backend también usa PATCH aquí
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status_id }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Error al eliminar el estatus de cuenta: " + errorText);
    }

    console.log("[DELETE] Estatus de cuenta excluido eliminado correctamente.");
  } catch (error: any) {
    console.error("[DELETE] Error al eliminar el estatus de cuenta:", error.message);
    throw error;
  }
}
