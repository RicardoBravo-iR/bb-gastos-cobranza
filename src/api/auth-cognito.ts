import { COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, COGNITO_GRANT_TYPE, COGNITO_SCOPE, COGNITO_URL } from "@/config";

// Variables en memoria para token y expiración
let memoryToken: string | null = null;
let memoryTokenExpiration = 0;

function getBasicAuthHeader(clientId: string, clientSecret: string) {
  const credentials = `${clientId}:${clientSecret}`;
  if (typeof window !== "undefined") {
    // Navegador
    return 'Basic ' + btoa(credentials);
  } else {
    // Node.js (SSR)
    return 'Basic ' + Buffer.from(credentials).toString('base64');
  }
}

export async function getCognitoToken() {
  const currentTime = Date.now();
  console.log("[Cognito] Iniciando obtención de token...");
  // Primero revisa en memoria
  if (memoryToken && currentTime < memoryTokenExpiration) {
    console.log("[Cognito] Token válido encontrado en memoria");
    return memoryToken;
  }
  // Luego revisa en localStorage
  const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const storedExpiration = typeof window !== "undefined" ? localStorage.getItem("token_expiration") : null;
  if (storedToken && storedExpiration && currentTime < Number(storedExpiration)) {
    console.log("[Cognito] Token válido encontrado en localStorage");
    memoryToken = storedToken;
    memoryTokenExpiration = Number(storedExpiration);
    return storedToken;
  }

  // Prepara el body urlencoded
  const params = new URLSearchParams();
  params.append("grant_type", COGNITO_GRANT_TYPE);
  params.append("scope", COGNITO_SCOPE);

  // Prepara el header Basic Auth
  const authHeader = getBasicAuthHeader(COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET);

  console.log("[Cognito] Solicitando token a:", COGNITO_URL);
  console.log("[Cognito] Headers:", { "Content-Type": "application/x-www-form-urlencoded", "Authorization": authHeader });
  console.log("[Cognito] Body:", params.toString());
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
    console.error('[Cognito] Error obteniendo token:', errorText);
    throw new Error('No se pudo obtener el token');
  }

  const jsonResponse = await response.json();
  memoryToken = jsonResponse.access_token;
  memoryTokenExpiration = Date.now() + (jsonResponse.expires_in * 1000);
  if (typeof window !== "undefined") {
    localStorage.setItem("token", memoryToken || '');
    localStorage.setItem("token_expiration", memoryTokenExpiration.toString());
  }
  console.log('[Cognito] Token obtenido:', memoryToken);
  return memoryToken;
}