// update-bines-excluir.ts
import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

export interface BinAExcluir {
  bin_id: string;
  bin: string;
}

/**
 * Actualiza un BIN excluido existente.
 * Se envía el objeto completo con los valores actualizados.
 *
 * @param bin - Objeto con los datos del BIN a actualizar
 */
export async function updateBinAExcluir(bin: BinAExcluir): Promise<void> {
  try {
    console.log("[PATCH] Iniciando actualización de BIN:", bin);

    const token = await getCognitoToken();
    const url = `${API_SAC}cobranzas/binExcluded/modify`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bin),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[PATCH] Error al actualizar el BIN:", errorText);
      throw new Error("Error al actualizar el BIN: " + errorText);
    }

    console.log("[PATCH] BIN actualizado correctamente.");
  } catch (error: any) {
    console.error("[PATCH] Error en updateBinExcluido:", error.message);
    throw error;
  }
}
