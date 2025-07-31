'use client';

import { getTarifasGenerales } from "@/api/get-tarifas-generales";
import { postTarifaGeneral } from "@/api/post-tarifas-generales";
import { deleteParametrosGenerales } from "@/api/delete-parametros-generales";
import { updateParametroGeneral } from "@/api/update-parametros-generales";
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Tabs from '@/components/tabs/Tabs';
import styles from '@/styles/ParametrosGenerales.module.css';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import Table from '@/components/tables/Table';
import FilteredInput from '@/components/inputs/filteredInputs/FilteredInput';
import FormInput from '@/components/inputs/formInput/FormInput'; 
import ExcelExport from '@/components/buttons/excelExport/ExcelExport';
import RegisterButton from '@/components/buttons/registerButton/RegisterButton';
import DeleteButton from '@/components/buttons/deleteButton/DeleteButton';
import FormSelect from '@/components/inputs/formSelect/FormSelect';
import LoadingSpinner from '@/components/loading/loadingSpinner/loadingSpinner';
import Swal from 'sweetalert2';

function ConsultaTarifas({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = getTarifasGenerales(refreshKey);
  const [filter, setFilter] = useState('');

  const rows = Array.isArray(data)
  ? [...data].sort((a, b) => a.codigoServicioFinanciero.localeCompare(b.codigoServicioFinanciero))
  : [];

  const filteredRows = rows.filter((param) =>
    param.codigoServicioFinanciero.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.operationTitle}>Consulta de Tarifas de Gastos de Cobranza</h2>

      {/* Filtro */}
      <form className={styles.filterContainer}>
        <FilteredInput
          label="SERVICIO FINANCIERO:"
          id="paramFilter"
          value={filter}
          placeholder="Buscar servicio financiero..."
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className={styles.exportButtonContainer}>
          <ExcelExport
            data={data}
            fileName="tarifas-gastos-cobranza.xlsx"
            label="Exportar Excel"
            sortBy="codigoServicioFinanciero"
            direction="asc"
            columnOrder={['codigoServicioFinanciero', 'diasVencidoDesde', 'diasVencidoHasta',
            'montoVencidoDesde', 'montoVencidoHasta', 'tarifaSinIva']}
            columnHeaders={{ codigoServicioFinanciero: 'codigoServicioFinanciero', diasVencidoDesde: 'diasVencidoDesde', 
              diasVencidoHasta: 'diasVencidoHasta', montoVencidoDesde: 'montoVencidoDesde', montoVencidoHasta: 'montoVencidoHasta',
              tarifaSinIva: 'tarifaSinIva'}}
          />
        </div>
      </form>

      {/* Tabla */}
      {loading && <LoadingSpinner size="lg" color="#0d6efd" text="Cargando tarifas..." />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <Table
          data={filteredRows}
          visibleColumns={['codigoServicioFinanciero', 'diasVencidoDesde', 'diasVencidoHasta',
            'montoVencidoDesde', 'montoVencidoHasta', 'tarifaSinIva']}
          headerLabels={{ codigoServicioFinanciero: 'Servicio Financiero', diasVencidoDesde: 'Dias Vencido Desde', 
            diasVencidoHasta: 'Dias Vencido Hasta', montoVencidoDesde: 'Monto Vencido Desde', montoVencidoHasta: 'Monto Vencido Desde', tarifaSinIva: 'Tarifa Sin IVA'}}
        />
      )}
    </div>
  );
}

function IngresoTarifas({ onRefresh }: { onRefresh: () => void }) {
  const [formData, setFormData] = useState({
    codigoServicioFinanciero: '',
    diasVencidoDesde: '',
    diasVencidoHasta: '',
    montoVencidoDesde: '',
    montoVencidoHasta: '',
    tarifaSinIva: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true); // Mostrar modal de confirmación
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const id = uuidv4(); // genera el UUID
      // Llama con el UUID y el resto de los datos
      await postTarifaGeneral(id, formData.codigoServicioFinanciero, formData.diasVencidoDesde, 
        formData.diasVencidoHasta, formData.montoVencidoDesde, formData.montoVencidoHasta, 
        formData.tarifaSinIva);

      Swal.fire({
        title: "Tarifa correctamente ingresada!",
        icon: "success",
        draggable: true
      });
      setFormData({
        codigoServicioFinanciero: '',
        diasVencidoDesde: '',
        diasVencidoHasta: '',
        montoVencidoDesde: '',
        montoVencidoHasta: '',
        tarifaSinIva: '',
      });
      onRefresh();
    } catch (err) {
      Swal.fire({
        title: "Error al ingresar tarifa!",
        icon: "error",
        draggable: true
      });
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.operationTitle}>Ingreso de Tarifas de Gastos de Cobranza</h2>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <FormInput
            label="SERVICIO FINANCIERO:"
            name="codigoServicioFinanciero"
            value={formData.codigoServicioFinanciero}
            placeholder="Ingrese nemónico del servicio financiero..."
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
        <div className={styles.formGroup}>
          <FormInput
            label="DIAS VENCIDO DESDE:"
            name="diasVencidoDesde"
            value={formData.diasVencidoDesde}
            placeholder="Ingrese dias vencido desde..."
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
        <div className={styles.formGroup}>
          <FormInput
            label="DIAS VENCIDO HASTA:"
            name="diasVencidoHasta"
            value={formData.diasVencidoHasta}
            placeholder="Ingrese dias vencido hasta..."
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
        <div className={styles.formGroup}>
          <FormInput
            label="MONTO VENCIDO DESDE:"
            name="montoVencidoDesde"
            value={formData.montoVencidoDesde}
            placeholder="Ingrese monto vencido desde..."
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
        <div className={styles.formGroup}>
          <FormInput
            label="MONTO VENCIDO HASTA:"
            name="montoVencidoHasta"
            value={formData.montoVencidoHasta}
            placeholder="Ingrese monto vencido hasta..."
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
        <div className={styles.formGroup}>
          <FormInput
            label="TARIFA SIN IVA:"
            name="tarifaSinIva"
            value={formData.tarifaSinIva}
            placeholder="Ingrese tarifa sin IVA..."
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
        <div className={styles.buttonContainer}>
          <RegisterButton type="submit">Ingresar Tarifa</RegisterButton>
        </div>
      </form>

      {/* Modal de Confirmación */}
      <ConfirmationModal
        isOpen={showModal}
        title="Confirmar ingreso"
        confirmText="Sí, ingresar"
        message={`¿Deseas ingresar el servicio financiero "${formData.codigoServicioFinanciero}" con los siguientes valores:\n
          Dias Vencido Desde: "${formData.diasVencidoDesde}"\n
          Dias Vencido Hasta: "${formData.diasVencidoHasta}"\n
          Monto Vencido Desde: "${formData.montoVencidoDesde}"\n
          Monto Vencido Hasta: "${formData.montoVencidoHasta}"\n
          Tarifa Sin IVA: "${formData.tarifaSinIva}"?`}
        cancelText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
        isSubmitting={loading}
      />
    </div>
  );
}

function EliminacionParametros({ refreshKey, onRefresh }: { refreshKey: number, onRefresh: () => void }) {
  const { data, loading: loadingData, error } = getTarifasGenerales(refreshKey);
  const [formData, setFormData] = useState({
    codigoServicioFinanciero: '',
    diasVencidoDesde: '',
    diasVencidoHasta: '',
    montoVencidoDesde: '',
    montoVencidoHasta: '',
    tarifaSinIva: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteParametrosGenerales(formData.codigoServicioFinanciero);

      Swal.fire({
        title: "Tarifa eliminada correctamente",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
      });

      setFormData({
        codigoServicioFinanciero: '',
        diasVencidoDesde: '',
        diasVencidoHasta: '',
        montoVencidoDesde: '',
        montoVencidoHasta: '',
        tarifaSinIva: '',
      });
      onRefresh()
    } catch (err) {
      Swal.fire({
        title: "Error al eliminar la tarifa",
        icon: "error",
        text: (err as Error).message || "",
      });
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  // Preparar opciones para el combo
  const servicioOptions = Array.isArray(data)
    ? [...data]
        .sort((a, b) => a.codigoServicioFinanciero.localeCompare(b.codigoServicioFinanciero))
        .map((param: any) => ({
          value: param.codigoServicioFinanciero,
          label: param.codigoServicioFinanciero,
        }))
    : [];

  const selectedServicio = Array.isArray(data)
  ? data.find((p) => p.codigoServicioFinanciero === formData.codigoServicioFinanciero)
  : null;

const valorActual = {diasVencidoDesde: selectedServicio?.diasVencidoDesde ?? "",
                     diasVencidoHasta: selectedServicio?.diasVencidoHasta ?? "",
                     montoVencidoDesde: selectedServicio?.montoVencidoDesde ?? "",
                     montoVencidoHasta: selectedServicio?.montoVencidoHasta ?? "",
                     tarifaSinIva: selectedServicio?.tarifaSinIva ?? "",
};

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.operationTitle}>Eliminación de Tarifas Generales</h2>

      {loadingData && <LoadingSpinner size="lg" color="#0d6efd" text="Cargando Tarifas..." />}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loadingData && !error && (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <FormSelect
              label="SERVICIO FINANCIERO:"
              name="codigoServicioFinanciero"
              value={formData.codigoServicioFinanciero}
              options={servicioOptions}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.buttonContainer}>
            <DeleteButton onClick={() => setShowModal(true)}>Eliminar Tarifa</DeleteButton>
          </div>
        </form>
      )}

      <ConfirmationModal
        isOpen={showModal}
        title="Confirmar eliminación"
        message={`¿Deseas eliminar el servicio financiero "${formData.codigoServicioFinanciero}" con los siguientes valores:\n
          Dias Vencido Desde: "${valorActual.diasVencidoDesde}"\n
          Dias Vencido Hasta: "${valorActual.diasVencidoHasta}"\n
          Monto Vencido Desde: "${valorActual.montoVencidoDesde}"\n
          Monto Vencido Hasta: "${valorActual.montoVencidoHasta}"\n
          Tarifa Sin IVA: "${valorActual.tarifaSinIva}"?`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowModal(false)}
        isSubmitting={loading}
      />
    </div>
  );
}


function ActualizacionParametros({ refreshKey, onRefresh }: { refreshKey: number; onRefresh: () => void }) {
  const { data: servicios, loading, error } = getParametrosGenerales(refreshKey);
  const [formData, setFormData] = useState({ parametro: "", valor: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.parametro || !formData.valor) {
      Swal.fire("Campos requeridos", "Debes completar ambos campos.", "warning");
      return;
    }

    const existe = servicios.some((p) => p.parametro === formData.parametro);

    if (!existe) {
      Swal.fire("Parámetro no encontrado", `El parámetro "${formData.parametro}" no existe.`, "error");
      return;
    }

    setShowModal(true);
  };

  // Preparar opciones para el select
  const servicioOptions = Array.isArray(servicios)
    ? [...servicios]
        .sort((a, b) => a.codigoServicioFinanciero.localeCompare(b.codigoServicioFinanciero))
        .map((param: any) => ({
          value: param.parametro,
          label: param.parametro,
        }))
    : [];

  const handleConfirmUpdate = async () => {
    setShowModal(false);
    setSubmitting(true);
    try {
      await updateParametroGeneral(formData.parametro, formData.valor);
      Swal.fire("Actualización exitosa", `El parámetro "${formData.parametro}" fue actualizado.`, "success");
      setFormData({ parametro: "", valor: "" });
      onRefresh();
    } catch (err: any) {
      Swal.fire("Error", err.message || "Ocurrió un error al actualizar.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedParametro = Array.isArray(parametros)
  ? parametros.find((p) => p.parametro === formData.parametro)
  : null;

  const valorActual = selectedParametro?.valor ?? "";

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.operationTitle}>Actualización de Parámetros Generales</h2>

      {loading && <LoadingSpinner size="lg" color="#0d6efd" text="Cargando parámetros..." />}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <FormSelect
              label="PARÁMETRO:"
              name="parametro"
              value={formData.parametro}
              options={parametroOptions}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <FormInput
              label="VALOR:"
              name="valor"
              value={formData.valor}
              placeholder="Ingrese el nuevo valor..."
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>
          <div className={styles.buttonContainer}>
            <RegisterButton type="submit" disabled={submitting}>
              {submitting ? "Actualizando..." : "Actualizar Parámetro"}
            </RegisterButton>
          </div>
        </form>
      )}

      <ConfirmationModal
        isOpen={showModal}
        title="Confirmar actualización"
        message={`¿Deseas actualizar el parámetro "${formData.parametro}" con el valor "${valorActual}", al nuevo valor "${formData.valor}"?`}
        confirmText="Sí, actualizar"
        cancelText="Cancelar"
        onConfirm={handleConfirmUpdate}
        onCancel={() => setShowModal(false)}
        isSubmitting={submitting}
      />
    </div>
  );
}

export default function ParametrosGenerales() {
  const [activeTab, setActiveTab] = useState('Consulta');
  const [isClient, setIsClient] = useState(false);
  const tabs = ['Consulta', 'Ingreso', 'Eliminación', 'Actualización'];
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className={styles.loadingContainer}>
      <LoadingSpinner size="lg" color="#0d6efd" text="Cargando datos..." /></div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Tarifario General de Gastos de Cobranza</h1>
      <div className={styles.tabsContainer}>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {activeTab === 'Consulta' && <ConsultaTarifas refreshKey={refreshKey} />}
      {activeTab === 'Ingreso' && <IngresoTarifas onRefresh={() => setRefreshKey(prev => prev + 1)} />}
      {activeTab === 'Eliminación' && <EliminacionParametros refreshKey={refreshKey} onRefresh={() => setRefreshKey(prev => prev + 1)} />}
      {activeTab === 'Actualización' && (<ActualizacionParametros refreshKey={refreshKey} onRefresh={() => setRefreshKey(prev => prev + 1)}/>
)}
    </div>
  );
}
