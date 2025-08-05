// src/api/post-estatus-cuenta-excluir.ts
import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

export interface EstatusCuentaExcluir {
  status_id: string;
  estatusCta: string;
}

/**
 * Registra un estatus de cuenta a excluir del cobro.
 * @param status_id - ID único del estatus
 * @param estatusCta - Valor del estatus (texto)
 */
export async function postEstatusCuentaAExcluir(status_id: string, estatusCta: string): Promise<void> {
  try {
    const token = await getCognitoToken();

    const url = `${API_SAC}cobranzas/statusDontApplyCharge/register`;
    const payload: EstatusCuentaExcluir = {
      status_id, estatusCta,
    };

    console.log("[POST ESTATUS EXCLUIR] URL:", url);
    console.log("[POST ESTATUS EXCLUIR] Payload:", payload);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[POST ESTATUS EXCLUIR] Error en la respuesta del API:", errorText);
      throw new Error("Error al registrar el estatus de cuenta a excluir: " + errorText);
    }

    console.log("[POST ESTATUS EXCLUIR] Estatus de cuenta a excluir registrado correctamente.");
  } catch (error: any) {
    console.error("[POST ESTATUS EXCLUIR] Error:", error.message);
    throw error;
  }
}
