// src/api/update-clientes-excluir.ts
import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

export interface ClienteAExcluir {
  cliente_id: string;
  fechaVigenciaHasta: string;
  identificacion: string;
}

/**
 * Actualiza un cliente a excluir existente.
 * Se envía el objeto completo con los valores.
 *
 * @param cliente - Objeto con los datos del cliente a excluir a actualizar
 */
export async function updateClienteAExcluir(cliente: ClienteAExcluir): Promise<void> {
  try {
    console.log(`[PATCH] Iniciando actualización de cliente a excluir:`, cliente);

    const token = await getCognitoToken();
    const url = `${API_SAC}cobranzas/clientDontApplyCharge/modify`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[PATCH] Error al actualizar el cliente a excluir: ${errorText}`);
      throw new Error("Error al actualizar el cliente a excluir: " + errorText);
    }

    console.log("[PATCH] Cliente a excluir actualizado correctamente.");
  } catch (error: any) {
    console.error("[PATCH] Error en updateClienteAExcluir:", error.message);
    throw error;
  }
}
