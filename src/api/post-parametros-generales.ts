import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

export async function postParametroGeneral(parametro: string, valor: string, descripcion: string): Promise<void> {
  try {
    const token = await getCognitoToken();

    const url = `${API_SAC}cobranzas/parameterCharge/register`; // Asegúrate de que este endpoint sea correcto
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ parametro, valor, descripcion }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Error al guardar el parámetro: " + errorText);
    }

    console.log("[POST] Parámetro creado correctamente.");
  } catch (error: any) {
    console.error("[POST] Error:", error.message);
    throw error;
  }
}
