import styles from "@/styles/CategoriaInterna.module.css";
import { useForm, useWatch } from "react-hook-form";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import Swal from 'sweetalert2';
import { getCatalogoByCategoria } from "@/api/use-catalog-categoria";
import { getCatalogoCategoria } from "@/api/types/catalogo-categoria";
import { getDatosCuentaByCuentaTarjeta } from "@/api/use-cuenta-categoria";
import { cuentaCategoriaResponse } from "@/api/types/cuenta-categoria";
import { RequestCambioCategoria, ResponseCambioCategoria } from "@/api/types/cambio-categoria";
import { useCambiaCategoria } from "@/api/use-cambia-categoria";


interface FormData {
  numeroTc: string;
  tipoTarjeta: string;
  cuenta: string;
  estadoCuenta: string;
  nombrePlastico: string;
  fechaApertura: string;
  nombrePlastico2: string;
  fechaExpiracion: string;
  tipoDiseñoPlastico: string;
  cicloFact: string;
  producto: string;
  codCliente: string;
  identificacion: string;
  categoria: string;
  catHomo: string;
  tipoCategoria: string;
  fecUltCambio: string;
  aplicaTipoCambio: boolean;
}

export default function CategoriaInterna() {
  const catInternaLayout = styles["cat-interna-layout"];
  const title = styles["title"];
  const container = styles["container"];
  const row = styles["row"];
  const field = styles["field"];
  const labelText = styles["label-text"];
  const NOMBRE_USUARIO = "zzsystem"

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<FormData>();

  const [formSnapshot, setFormSnapshot] = useState<FormData | null>(null);
  const [busquedaExitosa, setBusquedaExitosa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<getCatalogoCategoria[]>([]);

  /**
   *  consulta los datos de la cuenta por el numero de la cuenta
   * @param cuenta numero de cuenta de la tarjeta
   * @throws Error si la cuenta es inválida o no se encuentra
   * @returns 
   */
  const consultarDatosCuenta = async (cuenta: string) => {
    if (!cuenta || cuenta.trim() === "") {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Debe ingresar una cuenta para buscar.'
      });
      return;
    }
    else if (cuenta.length < 10 || cuenta.length > 12) {
      Swal.fire({
        icon: 'warning',
        title: 'Cuenta inválida',
        text: 'La cuenta debe tener entre 10 y 12 dígitos.'
      });
      return;
    }
    setLoading(true);
    try {
      const data: cuentaCategoriaResponse = await getDatosCuentaByCuentaTarjeta(cuenta)
      if (data.s_codigo_error !== 0) {
        setBusquedaExitosa(false);
        setValue("cuenta", "");
        throw new Error(data.s_mensaje_error);
      }
      console.log("Datos de la cuenta:", data);
      setValue("cuenta", data.s_cuenta);
      setValue("numeroTc", data.s_tarjeta);
      setValue("nombrePlastico", data.s_nombre_plastico_1);
      setValue("nombrePlastico2", data.s_nombre_plastico_2);
      setValue("identificacion", data.s_numero_identificacion);
      setValue("codCliente", data.s_identcli);
      setValue("categoria", data.s_categoria);
      setValue("catHomo", data.s_categoria_homologada || "");
      setValue("estadoCuenta", data.s_estado_cuenta);
      setValue("fechaApertura", data.s_fecha_apertura);
      setValue("fechaExpiracion", data.s_fecha_expiracion.toString());
      setValue("tipoDiseñoPlastico", data.s_tipo_tarjeta);
      setValue("tipoTarjeta", data.s_participacion);
      setValue("producto", data.s_producto);
      setValue("cicloFact", data.s_ciclo_facturacion.toString());
      setValue("tipoCategoria", data.s_tipo_categoria);
      setValue("fecUltCambio", data.s_fecha_ult_cambio_categoria);
      setValue("aplicaTipoCambio", data.s_tipo_cambio_categoria === "D");
      setBusquedaExitosa(true);
      setFormSnapshot(getValues())

      Swal.fire({
        icon: 'success',
        title: 'Consulta exitosa',
        text: 'Los datos fueron recuperados correctamente.'
      });
    } catch (error: Error | any) {
      console.error("Error al consultar los datos de la cuenta:", error);
      setBusquedaExitosa(false);
      setValue("cuenta", "");
      Swal.fire({
        icon: 'error',
        title: 'Error en la consulta',
        text: error.message || 'Ocurrió un error inesperado.'
      });
    } finally {
      setLoading(false);
    }

  }
  /**
   * verifica si hay cambios reales en el formulario comparando con el snapshot inicial
   * @returns booleano indicando si hay cambios reales
   */
  const watchedValues = useWatch({ control });
  const hasRealChanges = React.useMemo(() => {
    if (!formSnapshot) return false;
    return Object.keys(formSnapshot).some(
      key => formSnapshot[key as keyof FormData] !== watchedValues[key as keyof FormData]
    );
  }, [formSnapshot, watchedValues]);
  /**
   *  cambia la categoria de la cuenta consultada
   * @param data datos del formulario para cambiar la categoría
   * @returns 
   */
  const cambiarCategoria = async (data: RequestCambioCategoria) => {
    if (data.cuenta.trim() === "" || data.nueva_cat.trim() == "" || data.nuevo_tipcamcat.trim() === "") {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Debe ingresar una cuenta y seleccionar una categoría.'
      });
      return;
    }
    setLoading(true);
    try {
      const response: ResponseCambioCategoria = await useCambiaCategoria(data);
      if (response.s_codigo_error !== 0) {
        throw new Error(response.s_mensaje_error || "Error al cambiar la categoría");
      }
      Swal.fire({
        icon: 'success',
        title: 'Categoría cambiada',
        text: response.s_mensaje_error || 'La categoría se ha cambiado exitosamente.'
      });
      reset();
    } catch (error: Error | any) {
      console.error("Error al cambiar la categoría:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al cambiar la categoría',
        text: error.message || 'Ocurrió un error inesperado.'
      });
    } finally {
      setLoading(false)
    }
  }

  

  // Maneja el envío del formulario
  const onSubmit = (data: any) => {
    console.log(data);
  };

  

  const fetchCatalogo = async () => {
    try {
      setLoading(true);
      const data = await getCatalogoByCategoria();
      setCategorias(data)

    } catch (error) {
      setError("Error al cargar el catálogo de categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchCatalogo();
  }, [])

  return (
    <>
      <Head>
        <title>Categoría Interna</title>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
      </Head>

      {loading && (
        <div className={styles["loading-overlay"]}>
          <div className="spinner-border text-primary" role="status" style={{ width: "4rem", height: "4rem" }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      <div className={catInternaLayout}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className={title}>Categoría Interna</h2>

          <div className="d-flex gap-2">
            <button type="button" className={styles.btnPrimario} title="Buscar"
              disabled={loading}
              onClick={() => {
                const cuenta = getValues("cuenta");
                consultarDatosCuenta(cuenta);
              }}>
              {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="bi bi-search"></i>}
            </button>

            <button type="button" className={busquedaExitosa && hasRealChanges ? styles.btnPrimario : styles.btnDisabled} title="Enviar"
              disabled={loading || !busquedaExitosa || !hasRealChanges}
              onClick={() => {
                if (!busquedaExitosa) {
                  Swal.fire({
                    icon: 'info',
                    title: 'Primero busque la cuenta',
                    text: 'Debe consultar la cuenta antes de enviar.'
                  });
                  return;
                }
                const cuenta = getValues("cuenta");
                const categoria = getValues("categoria");
                const aplicaTipoCambio = getValues("aplicaTipoCambio");
                const request: RequestCambioCategoria = {
                  cuenta: cuenta,
                  nueva_cat: categoria,
                  nuevo_tipcamcat: aplicaTipoCambio ? "D" : "T",
                  ejecutivo: NOMBRE_USUARIO
                }
                cambiarCategoria(request)

              }}>
              {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="bi bi-send-fill"></i>}
            </button>
          </div>
        </div>

        <div className={container}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={row}>
              <FormInput id="numeroTc" label="Número de Tarjeta" register={register("numeroTc")}
                inputClassName={`${field}`} className="w-100" labelClassName={`fw-bold ${labelText}`} disabled={true} />

              <FormInput id="tipoTarjeta" label="Tipo Tarjeta" register={register("tipoTarjeta")}
                inputClassName={`${field}`} className="w-25" labelClassName={`fw-bold ${labelText}`} disabled={true} />

              <FormInput id="cuenta" label="Cuenta" register={register("cuenta",)} autoComplete="off"
                inputClassName={`${field}`} className="w-75" labelClassName={`fw-bold ${labelText}`} />

              <FormInput id="estadoCuenta" label="Estado Cuenta" register={register("estadoCuenta")}
                inputClassName={`${field}`} className="w-50" labelClassName={`fw-bold ${labelText}`} disabled={true} />
            </div>
            <div className={row}>
              <FormInput id="nombrePlastico" label="Nombre Plástico" register={register("nombrePlastico")}
                inputClassName={`${field}`} className="w-100" labelClassName={`fw-bold ${labelText}`} disabled={true} />
              <FormInput id="fechaApertura" label="Fecha de Apertura" register={register("fechaApertura")}
                inputClassName={`${field}`} className="w-25" labelClassName={`fw-bold ${labelText}`} disabled={true} />
            </div>
            <div className={row}>
              <FormInput id="nombrePlastico2" label="Nombre Plástico 2" register={register("nombrePlastico2")}
                inputClassName={`${field}`} className="w-100" labelClassName={`fw-bold ${labelText}`} disabled={true} />
              <FormInput id="fechaExpiracion" label="Fecha de Expiración" register={register("fechaExpiracion")}
                inputClassName={`${field}`} className="w-25" labelClassName={`fw-bold ${labelText}`} disabled={true} />
            </div>
            <div className={row}>
              <FormInput id="tipoDiseñoPlastico" label="Nombre de Diseño de Plástico"
                register={register("tipoDiseñoPlastico")} inputClassName={`${field}`} className="w-100" labelClassName={`fw-bold ${labelText}`} disabled={true} />
              <FormInput id="cicloFact" label="Ciclo Fact." register={register("cicloFact")}
                inputClassName={`${field}`} className="w-25" labelClassName={`fw-bold ${labelText}`} disabled={true} />
            </div>
            <div className={row}>
              <FormInput id="producto" label="Producto" register={register("producto")}
                inputClassName={`${field}`} className="w-100" labelClassName={`fw-bold ${labelText}`} disabled={true} />
            </div>

            <div className={row}>
              <FormInput id="codCliente" label="Cod. Cliente" register={register("codCliente")}
                inputClassName={`${field}`} className="w-25" labelClassName={`fw-bold ${labelText}`} disabled={true} />

              <FormInput id="identificacion" label="Identificación" register={register("identificacion")}
                inputClassName={`${field}`} className="w-75" labelClassName={`fw-bold ${labelText}`} disabled={true} />
            </div>

            <div className={row}>
              <FormSelect
                id="categoria"
                label="Categoría"
                register={register("categoria", { required: "Seleccione una categoría válida" })}
                options={categorias}
                selectClassName={field}
                className="w-50"
                labelClassName={`fw-bold ${labelText}`}
              />
              {errors.categoria && (
                <span className="text-danger">{errors.categoria.message}</span>
              )}

              {getValues("catHomo") && (
                <FormInput
                  id="catHomo"
                  label="Categoría Homologada"
                  register={register("catHomo")}
                  inputClassName={field}
                  className="w-50"
                  labelClassName={`fw-bold ${labelText}`}
                  disabled={true}
                />
              )}
            </div>

            <div className={row}>
              <div className="col-4">
                <FormInput id="tipoCategoria" label="Tipo de Categoría" register={register("tipoCategoria")}
                  inputClassName={`${field}`} className="w-100" labelClassName={`fw-bold ${labelText}`} disabled={true} />
              </div>

              <div className="col-4">
                <FormInput id="fecUltCambio" label="Fecha de Último Cambio" register={register("fecUltCambio")}
                  inputClassName={`${field}`} className="w-100" labelClassName={`fw-bold ${labelText}`} disabled={true} />
              </div>

              <div className="col-4 d-flex align-items-center mt-4">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="aplicaTipoCambio" {...register("aplicaTipoCambio")} />
                  <label className="form-check-label" htmlFor="aplicaTipoCambio">
                    Aplica Tipo de Cambio de Categoría Definitivo
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}