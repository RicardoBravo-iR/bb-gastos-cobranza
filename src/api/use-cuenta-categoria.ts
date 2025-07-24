import { API_URL } from "@/config";
import { cuentaCategoriaResponse } from "./types/cuenta-categoria";


export const getDatosCuentaByCuentaTarjeta = async (cuenta: string) => {
    const response = await fetch(`${API_URL}/categoria-usuario`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ cuenta })
    });

    if (response.status === 400) {
        throw new Error("Solicitud incorrecta, por favor verifica los datos enviados");
    } else if (response.status === 404) {
        throw new Error("Cuenta de Tarjeta no existe");
    } else if (!response.ok) {
        throw new Error(`Error al obtener los datos de la cuenta (${response.status})`);
    }

    const data = await response.json();
    return data as cuentaCategoriaResponse;
}

