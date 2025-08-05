'use client';

import { getEstatusCuentaExcluir } from "@/api/get-estatus-cuenta-excluir";
import { postEstatusCuentaAExcluir } from "@/api/post-estatus-cuenta-excluir";
import { deleteEstatusCuentaAExcluir } from "@/api/delete-estatus-cuenta-excluir";
import { updateEstatusCuentaAExcluir } from "@/api/update-estatus-cuenta-excluir";
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

function ConsultaEstatusCuentaAExcluir({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = getEstatusCuentaExcluir(refreshKey);
  const [filter, setFilter] = useState('');

const rows = Array.isArray(data)
  ? [...data].sort((a, b) => a.estatusCta.localeCompare(b.estatusCta))
  : [];

  const filteredRows = rows.filter((param) =>
        param.estatusCta.toLowerCase().includes(filter.toLowerCase())

  );

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.operationTitle}>Consulta de Estatus de Cuenta a excluir en Gastos de Cobranza</h2>

      {/* Filtro */}
      <form className={styles.filterContainer}>
        <FilteredInput
          label="ESTATUS DE CUENTA:"
          id="paramFilter"
          value={filter}
          placeholder="Buscar estatus de cuenta..."
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className={styles.exportButtonContainer}>
          <ExcelExport
            data={data}
            fileName="estatus-cuenta-excluir.xlsx"
            label="Exportar Excel"
            sortBy="estatusCta"
            direction="asc"
            columnOrder={['estatusCta']}
            columnHeaders={{ estatusCta: 'Estatus de Cuenta'}}
          />
        </div>
      </form>

      {/* Tabla */}
      {loading && <LoadingSpinner size="lg" color="#0d6efd" text="Cargando estatus de cuenta a excluir..." />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <Table
          data={filteredRows}
          visibleColumns={['estatusCta']}
          headerLabels={{ estatusCta: 'Estatus de Cuenta'}}
        />
      )}
    </div>
  );
}

function IngresoEstatusCuentaAExcluir({ onRefresh }: { onRefresh: () => void }) {
  const [formData, setFormData] = useState({
    estatusCta: '',
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
      await postEstatusCuentaAExcluir(id, formData.estatusCta);

      Swal.fire({
        title: "Estatus de Cuenta correctamente ingresado!",
        icon: "success",
        draggable: true
      });
      setFormData({
        estatusCta: '',
      });
      onRefresh();
    } catch (err) {
      Swal.fire({
        title: "Error al ingresar estatus de cuenta!",
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
      <h2 className={styles.operationTitle}>Ingreso de Estatus de Cuenta de Gastos de Cobranza</h2>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <FormInput
            label="ESTATUS DE CUENTA:"
            name="estatusCta"
            value={formData.estatusCta}
            placeholder="Ingrese el nuevo estatus de cuenta a excluir..."
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
        <div className={styles.buttonContainer}>
          <RegisterButton type="submit">Ingresar Estatus de Cuenta</RegisterButton>
        </div>
      </form>

      {/* Modal de Confirmación */}
      <ConfirmationModal
        isOpen={showModal}
        title="Confirmar ingreso"
        confirmText="Sí, ingresar"
        message={`¿Deseas ingresar el estatus de cuenta "${formData.estatusCta}"?`}
        cancelText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
        isSubmitting={loading}
      />
    </div>
  );
}

function EliminacionEstatusCuentaAExcluir({ refreshKey, onRefresh }: { refreshKey: number, onRefresh: () => void }) {
  const { data, loading: loadingData, error } = getEstatusCuentaExcluir(refreshKey);
  const [formData, setFormData] = useState({
    estatusCta: '',
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
  if (!selectedEstatusCta) {
    Swal.fire("Error", "No se encontró el estatus de cuenta seleccionado.", "error");
    setShowModal(false);
    return;
  }

  setLoading(true);
  try {
    await deleteEstatusCuentaAExcluir(selectedEstatusCta.status_id); // solo el id

    Swal.fire({
      title: "Estatus de cuenta eliminado correctamente",
      icon: "success",
      timer: 2000,
      timerProgressBar: true,
    });

    setFormData({
      estatusCta: ''
    });
    onRefresh();
  } catch (err) {
    Swal.fire({
      title: "Error al eliminar el estatus de cuenta",
      icon: "error",
      text: (err as Error).message || "",
    });
  } finally {
    setLoading(false);
    setShowModal(false);
  }
};


  // Preparar opciones para el combo
  const estatusCtaOptions = Array.isArray(data)
    ? [...data]
        .sort((a, b) => a.estatusCta.localeCompare(b.estatusCta))
        .map((param: any) => ({
          value: param.estatusCta,
          label: param.estatusCta,
        }))
    : [];

  const selectedEstatusCta = Array.isArray(data)
  ? data.find((p) => p.estatusCta === formData.estatusCta)
  : null;

  const valorActual = {estatusCta: selectedEstatusCta?.estatusCta ?? "" };

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.operationTitle}>Eliminación de Estatus de Cuenta en Gastos de Cobranza</h2>

      {loadingData && <LoadingSpinner size="lg" color="#0d6efd" text="Cargando estatus de cuenta..." />}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loadingData && !error && (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <FormSelect
              label="ESTATUS DE CUENTA:"
              name="estatusCta"
              value={formData.estatusCta}
              options={estatusCtaOptions}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.buttonContainer}>
            <DeleteButton onClick={() => setShowModal(true)}>Eliminar Estatus de Cuenta</DeleteButton>
          </div>
        </form>
      )}

      <ConfirmationModal
        isOpen={showModal}
        title="Confirmar eliminación"
        message={`¿Deseas eliminar el estatus de cuenta "${formData.estatusCta}" ?`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowModal(false)}
        isSubmitting={loading}
      />
    </div>
  );
}


function ActualizacionEstatusCuentaAExcluir({refreshKey, onRefresh,}: {
  refreshKey: number;
  onRefresh: () => void;
}) {
  const { data: estatus, loading, error } = getEstatusCuentaExcluir(refreshKey);
  const [formData, setFormData] = useState({
    estatusCta: '',
    estatusCtaActualizado: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Servicio seleccionado en base al código seleccionado
  const selectedEstatusCta = Array.isArray(estatus)
    ? estatus.find((p) => p.estatusCta === formData.estatusCta)
    : null;

  const valorActual = {
    bin: selectedEstatusCta?.estatusCta ?? '',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.estatusCta
    ) {
      Swal.fire('Campos requeridos', 'Debes completar todos campos.', 'warning');
      return;
    }

    if (!selectedEstatusCta) {
      Swal.fire(
        'Estatus de Cuenta no encontrado',
        `El Estatus de Cuenta "${formData.estatusCta}" no existe.`,
        'error'
      );
      return;
    }

    setShowModal(true);
  };

  // Opciones para el select de servicio financiero
  const estatusCtaOptions = Array.isArray(estatus)
    ? [...estatus]
        .sort((a, b) => a.estatusCta.localeCompare(b.estatusCta))
        .map((param: any) => ({
          value: param.estatusCta,
          label: param.estatusCta,
        }))
    : [];

  const handleConfirmUpdate = async () => {
    if (!selectedEstatusCta) {
      Swal.fire('Error', 'No hay estatus de cuenta seleccionado válido.', 'error');
      setShowModal(false);
      return;
    }

    setShowModal(false);
    setSubmitting(true);

    // Construir payload de actualización (solo campos editables)
    const updates = {
      binActualizado: formData.estatusCtaActualizado, // si aplica en tu API
    };

    try {
      // Se asume que updateTarifaGeneral acepta (tarifa_id, updates)
      await updateEstatusCuentaAExcluir({status_id: selectedEstatusCta.status_id, 
        estatusCta: formData.estatusCtaActualizado});
      Swal.fire(
        'Actualización exitosa',
        `El Estatus de Cuenta "${formData.estatusCta}" fue actualizado.`,
        'success'
      );
      setFormData({
        estatusCta: '',
        estatusCtaActualizado: '',
      });
      onRefresh();
    } catch (err: any) {
      Swal.fire('Error', err.message || 'Ocurrió un error al actualizar.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.operationTitle}>Actualización de Estatus de Cuenta a excluir en Gastos de Cobranza</h2>

      {loading && <LoadingSpinner size="lg" color="#0d6efd" text="Cargando estatus de cuenta..." />}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <FormSelect
              label="ESTATUS DE CUENTA:"
              name="estatusCta"
              value={formData.estatusCta}
              options={estatusCtaOptions}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <FormInput
              label="ESTATUS DE CUENTA:"
              name="estatusCtaActualizado"
              value={formData.estatusCtaActualizado}
              placeholder="Ingrese el nuevo valor del estatus de cuenta..."
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>
          <div className={styles.buttonContainer}>
            <RegisterButton type="submit" disabled={submitting}>
              {submitting ? 'Actualizando...' : 'Actualizar Estatus de Cuenta'}
            </RegisterButton>
          </div>
        </form>
      )}

      <ConfirmationModal
        isOpen={showModal}
        title="Confirmar actualización"
        message={`¿Deseas actualizar el estatus de cuenta: "${formData.estatusCta}" al nuevo valor "${formData.estatusCtaActualizado}"?`}
        confirmText="Sí, actualizar"
        cancelText="Cancelar"
        onConfirm={handleConfirmUpdate}
        onCancel={() => setShowModal(false)}
        isSubmitting={submitting}
      />
    </div>
  );
}

export default function EstatusCuentaAExcluir() {
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
      <h1 className={styles.pageTitle}>Estatus de Cuenta a excluir en Gastos de Cobranza</h1>
      <div className={styles.tabsContainer}>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {activeTab === 'Consulta' && <ConsultaEstatusCuentaAExcluir refreshKey={refreshKey} />}
      {activeTab === 'Ingreso' && <IngresoEstatusCuentaAExcluir onRefresh={() => setRefreshKey(prev => prev + 1)} />}
      {activeTab === 'Eliminación' && <EliminacionEstatusCuentaAExcluir refreshKey={refreshKey} onRefresh={() => setRefreshKey(prev => prev + 1)} />}
      {activeTab === 'Actualización' && (<ActualizacionEstatusCuentaAExcluir refreshKey={refreshKey} onRefresh={() => setRefreshKey(prev => prev + 1)}/>
)}
    </div>
  );
}
