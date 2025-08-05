// delete-bines-excluir.ts
import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

/**
 * Elimina un BIN excluido enviando solo su ID.
 * @param bin_id - Identificador del BIN a eliminar
 */
export async function deleteBinAExcluir(bin_id: string): Promise<void> {
  try {
    const token = await getCognitoToken();
    const url = `${API_SAC}cobranzas/binExcluded/delete`;
    console.log("[DELETE] Token usado:", token);
    console.log("[DELETE] Payload de eliminación:", { bin_id });

    const response = await fetch(url, {
      method: "PATCH", // asumiendo que también es PATCH como en tarifas
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bin_id }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Error al eliminar el BIN: " + errorText);
    }

    console.log("[DELETE] BIN eliminado correctamente.");
  } catch (error: any) {
    console.error("[DELETE] Error al eliminar el BIN:", error.message);
    throw error;
  }
}
