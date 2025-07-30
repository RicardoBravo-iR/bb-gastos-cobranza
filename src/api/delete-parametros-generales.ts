import { API_SAC } from "@/config";
import { getCognitoToken } from "@/api/auth-cognito";

export async function deleteParametrosGenerales(parametro: string): Promise<void> {
  try {
    const token = await getCognitoToken();
    const url = `${API_SAC}cobranzas/parameterCharge/delete`;
    console.log(token);

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parametro }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Error al eliminar el parámetro: " + errorText);
    }

    console.log("[DELETE] Parámetro eliminado correctamente.");
  } catch (error: any) {
    console.error("[DELETE] Error:", error.message);
    throw error;
  }
}
