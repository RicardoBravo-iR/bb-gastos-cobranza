export interface ResponseCambioCategoria {
    s_codigo_error:number;
    s_mensaje_error:string;
}

export interface RequestCambioCategoria{
    // "cuenta":"510764879071",
    // "nueva_cat":"P",
    // "nuevo_tipcamcat":"e"
    cuenta: string;
    nueva_cat: string;
    nuevo_tipcamcat: string;
    ejecutivo:string // "e" para efectivo, "t" para tarjeta
}
