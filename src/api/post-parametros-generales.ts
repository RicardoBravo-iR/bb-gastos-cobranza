import { API_SAC, COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, COGNITO_GRANT_TYPE, COGNITO_SCOPE, COGNITO_URL } from "@/config";

// Reutiliza las funciones ya existentes si están en otro archivo
function getBasicAuthHeader(clientId: string, clientSecret: string) {
  const credentials = `${clientId}:${clientSecret}`;
  if (typeof window !== "undefined") {
    return 'Basic ' + btoa(credentials);
  } else {
    return 'Basic ' + Buffer.from(credentials).toString('base64');
  }
}

let memoryToken: string | null = null;
let memoryTokenExpiration = 0;

async function getCognitoToken() {
  const currentTime = Date.now();
  if (memoryToken && currentTime < memoryTokenExpiration) {
    return memoryToken;
  }

  const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const storedExpiration = typeof window !== "undefined" ? localStorage.getItem("token_expiration") : null;
  if (storedToken && storedExpiration && currentTime < Number(storedExpiration)) {
    memoryToken = storedToken;
    memoryTokenExpiration = Number(storedExpiration);
    return storedToken;
  }

  const params = new URLSearchParams();
  params.append("grant_type", COGNITO_GRANT_TYPE);
  params.append("scope", COGNITO_SCOPE);
  const authHeader = getBasicAuthHeader(COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET);

  const response = await fetch(COGNITO_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": authHeader,
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error('No se pudo obtener el token: ' + errorText);
  }

  const json = await response.json();
  memoryToken = json.access_token;
  memoryTokenExpiration = Date.now() + (json.expires_in * 1000);
  if (typeof window !== "undefined") {
    localStorage.setItem("token", memoryToken || '');
    localStorage.setItem("token_expiration", memoryTokenExpiration.toString());
  }
  return memoryToken;
}

export async function postParametroGeneral(parametro: string, valor: string): Promise<void> {
  try {
    const token = await getCognitoToken();

    const url = `${API_SAC}cobranzas/parameterCharge/register`; // Asegúrate de que este sea el endpoint correcto para el POST
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ parametro, valor }),
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
