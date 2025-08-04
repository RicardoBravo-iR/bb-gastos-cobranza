// src/api/post-clientes-excluir.ts
import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

export interface ClienteAExcluir {
  cliente_id: string;
  fechaVigenciaHasta: string;
  identificacion: string;
}

export async function postClienteAExcluir(
  cliente_id: string,
  fechaVigenciaHasta: string,
  identificacion: string
): Promise<void> {
  try {
    const token = await getCognitoToken();

    const url = `${API_SAC}cobranzas/clientDontApplyCharge/register`;
    const payload: ClienteAExcluir = {
      cliente_id,
      identificacion,
      fechaVigenciaHasta,
    };

    console.log("[POST CLIENTE A EXCLUIR] URL:", url);
    console.log("[POST CLIENTE A EXCLUIR] Payload:", payload);

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
      console.error("[POST CLIENTE A EXCLUIR] Error en la respuesta del API:", errorText);
      throw new Error("Error al registrar el cliente a excluir: " + errorText);
    }

    console.log("[POST CLIENTE A EXCLUIR] Cliente a excluir registrado correctamente.");
  } catch (error: any) {
    console.error("[POST CLIENTE A EXCLUIR] Error:", error.message);
    throw error;
  }
}
