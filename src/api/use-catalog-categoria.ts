import { API_URL } from "@/config"
import { getCatalogoCategoria } from "./types/catalogo-categoria";
export const getCatalogoByCategoria = async () => {
    const response = await fetch(`${API_URL}/categorias`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (!response.ok) {
        throw new Error("Error al obtener el catálogo de categorías");
    }
    const data = await response.json();
    return data.map((item: any) => ({
        s_nombre: item.s_nombre,
        s_valor: item.s_valor,
        s_descripcion: item.s_descripcion
    })) as getCatalogoCategoria[];

}