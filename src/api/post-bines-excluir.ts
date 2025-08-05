// src/api/post-bines-excluir.ts
import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

export interface BinExcluir {
  bin_id: string;
  bin: string;
}


export async function postBinAExcluir(bin_id: string, bin: string,): Promise<void> {
  try {
    const token = await getCognitoToken();

    const url = `${API_SAC}cobranzas/binExcluded/register`;
    const payload: BinExcluir = {
      bin_id, bin
    };

    console.log("[POST BIN EXCLUIR] URL:", url);
    console.log("[POST BIN EXCLUIR] Payload:", payload);

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
      console.error("[POST BIN EXCLUIR] Error en la respuesta del API:", errorText);
      throw new Error("Error al registrar el bin a excluir: " + errorText);
    }

    console.log("[POST BIN EXCLUIR] Bin a excluir registrado correctamente.");
  } catch (error: any) {
    console.error("[POST BIN EXCLUIR] Error:", error.message);
    throw error;
  }
}
