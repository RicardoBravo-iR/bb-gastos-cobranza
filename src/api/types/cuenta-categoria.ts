export interface cuentaCategoriaResponse {
    s_codigo_error: number;
    s_mensaje_error: string;
    s_cuenta: string;
    s_tarjeta: string;
    s_nombre_plastico_1: string;
    s_nombre_plastico_2: string;
    s_identcli: string;
    s_numero_identificacion: string;
    s_categoria: string;
    s_participacion: string;
    s_estado_cuenta: string;
    s_fecha_apertura: string;
    s_fecha_expiracion: number;
    s_tipo_cambio_categoria: string;
    s_cod_tipo_tarjeta: string;
    s_tipo_tarjeta: string;
    s_producto: string;
    s_ciclo_facturacion: number;
    s_categoria_homologada: string | null;
    s_tipo_categoria: string;
    s_fecha_ult_cambio_categoria: string;
}