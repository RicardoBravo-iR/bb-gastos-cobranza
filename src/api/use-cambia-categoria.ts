import { API_URL } from "@/config"
import { RequestCambioCategoria, ResponseCambioCategoria } from "./types/cambio-categoria";
 
 
export const useCambiaCategoria = async (request:RequestCambioCategoria) => {
    const response = await fetch(`${API_URL}/actualizar-categoria`,{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })
    if (response.status === 400) {
        throw new Error("Solicitud incorrecta, por favor verifica los datos enviados");
    } else if (response.status === 404) {
        throw new Error("Cuenta no encontrada en el sistema");
    } else if (!response.ok) {
        throw new Error(`Error al realizar el cambio de categoria (${response.status})`);
    }
    const data = await response.json();
    return data as ResponseCambioCategoria;

}

