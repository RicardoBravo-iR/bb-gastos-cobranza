// update-parametros-generales.ts
import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

/**
 * Actualiza únicamente el valor de un parámetro general existente
 * mediante una solicitud PATCH.
 *
 * @param parametro - Nombre del parámetro (no se modifica)
 * @param nuevoValor - Nuevo valor que se desea asignar
 */
export async function updateParametroGeneral(parametro: string, nuevoValor: string, nuevaDescripcion: string): Promise<void> {
  try {
    console.log(`[PATCH] Iniciando actualización del parámetro "${parametro}" con el nuevo valor "${nuevoValor}"...`);

    const token = await getCognitoToken();
    const url = `${API_SAC}cobranzas/parameterCharge/modify`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parametro, valor: nuevoValor, descripcion: nuevaDescripcion }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Error al actualizar el parámetro: " + errorText);
    }

    console.log(`[PATCH] Parámetro "${parametro}" actualizado con éxito.`);
  } catch (error: any) {
    console.error(`[PATCH] Error al actualizar el parámetro "${parametro}":`, error.message);
    throw error;
  }
}
