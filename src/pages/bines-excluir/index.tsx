'use client';

import { getBinesExcluir } from "@/api/get-bines-excluir";
import { postBinAExcluir } from "@/api/post-bines-excluir";
import { deleteBinAExcluir } from "@/api/delete-bines-excluir";
import { updateBinAExcluir } from "@/api/update-bines-excluir";
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

function ConsultaBinesAExcluir({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = getBinesExcluir(refreshKey);
  const [filter, setFilter] = useState('');

const rows = Array.isArray(data)
  ? [...data].sort((a, b) => Number(a.bin) - Number(b.bin))
  : [];

  const filteredRows = rows.filter((param) =>
    param.bin.includes(filter.toLowerCase())
  );

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.operationTitle}>Consulta Bines a excluir en Gastos de Cobranza</h2>

      {/* Filtro */}
      <form className={styles.filterContainer}>
        <FilteredInput
          label="BIN:"
          id="paramFilter"
          value={filter}
          placeholder="Buscar bin..."
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className={styles.exportButtonContainer}>
          <ExcelExport
            data={data}
            fileName="bines-excluir.xlsx"
            label="Exportar Excel"
            sortBy="bin"
            direction="asc"
            columnOrder={['bin']}
            columnHeaders={{ bin: 'Bin'}}
          />
        </div>
      </form>

      {/* Tabla */}
      {loading && <LoadingSpinner size="lg" color="#0d6efd" text="Cargando bines a excluir..." />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <Table
          data={filteredRows}
          visibleColumns={['bin']}
          headerLabels={{ bin: 'Bin'}}
        />
      )}
    </div>
  );
}

function IngresoBinesAExcluir({ onRefresh }: { onRefresh: () => void }) {
  const [formData, setFormData] = useState({
    bin: '',
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
      await postBinAExcluir(id, formData.bin);

      Swal.fire({
        title: "Bin correctamente ingresado!",
        icon: "success",
        draggable: true
      });
      setFormData({
        bin: '',
      });
      onRefresh();
    } catch (err) {
      Swal.fire({
        title: "Error al ingresar bin!",
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
            label="BIN:"
            name="bin"
            value={formData.bin}
            placeholder="Ingrese el nuevo bin a excluir..."
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
        <div className={styles.buttonContainer}>
          <RegisterButton type="submit">Ingresar Bin</RegisterButton>
        </div>
      </form>

      {/* Modal de Confirmación */}
      <ConfirmationModal
        isOpen={showModal}
        title="Confirmar ingreso"
        confirmText="Sí, ingresar"
        message={`¿Deseas ingresar el bin "${formData.bin}"?`}
        cancelText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
        isSubmitting={loading}
      />
    </div>
  );
}

function EliminacionBinesAExcluir({ refreshKey, onRefresh }: { refreshKey: number, onRefresh: () => void }) {
  const { data, loading: loadingData, error } = getBinesExcluir(refreshKey);
  const [formData, setFormData] = useState({
    bin: '',
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
  if (!selectedBin) {
    Swal.fire("Error", "No se encontró el bin seleccionado.", "error");
    setShowModal(false);
    return;
  }

  setLoading(true);
  try {
    await deleteBinAExcluir(selectedBin.bin_id); // solo el id

    Swal.fire({
      title: "Bin eliminado correctamente",
      icon: "success",
      timer: 2000,
      timerProgressBar: true,
    });

    setFormData({
      bin: ''
    });
    onRefresh();
  } catch (err) {
    Swal.fire({
      title: "Error al eliminar el bin",
      icon: "error",
      text: (err as Error).message || "",
    });
  } finally {
    setLoading(false);
    setShowModal(false);
  }
};


  // Preparar opciones para el combo
  const binOptions = Array.isArray(data)
    ? [...data]
        .sort((a, b) => a.bin.localeCompare(b.bin))
        .map((param: any) => ({
          value: param.bin,
          label: param.bin,
        }))
    : [];

  const selectedBin = Array.isArray(data)
  ? data.find((p) => p.bin === formData.bin)
  : null;

  const valorActual = {bin: selectedBin?.bin ?? "" };

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.operationTitle}>Eliminación de Bines en Gastos de Cobranza</h2>

      {loadingData && <LoadingSpinner size="lg" color="#0d6efd" text="Cargando bines..." />}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loadingData && !error && (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <FormSelect
              label="BIN:"
              name="bin"
              value={formData.bin}
              options={binOptions}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.buttonContainer}>
            <DeleteButton onClick={() => setShowModal(true)}>Eliminar Bin</DeleteButton>
          </div>
        </form>
      )}

      <ConfirmationModal
        isOpen={showModal}
        title="Confirmar eliminación"
        message={`¿Deseas eliminar el bin "${formData.bin}" ?`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowModal(false)}
        isSubmitting={loading}
      />
    </div>
  );
}


function ActualizacionBinesAExcluir({refreshKey, onRefresh,}: {
  refreshKey: number;
  onRefresh: () => void;
}) {
  const { data: bines, loading, error } = getBinesExcluir(refreshKey);
  const [formData, setFormData] = useState({
    bin: '',
    binActualizado: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Servicio seleccionado en base al código seleccionado
  const selectedBin = Array.isArray(bines)
    ? bines.find((p) => p.bin === formData.bin)
    : null;

  const valorActual = {
    bin: selectedBin?.bin ?? '',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.bin
    ) {
      Swal.fire('Campos requeridos', 'Debes completar todos campos.', 'warning');
      return;
    }

    if (!selectedBin) {
      Swal.fire(
        'Bin no encontrado',
        `El bin "${formData.bin}" no existe.`,
        'error'
      );
      return;
    }

    setShowModal(true);
  };

  // Opciones para el select de servicio financiero
  const binOptions = Array.isArray(bines)
    ? [...bines]
        .sort((a, b) => a.bin.localeCompare(b.bin))
        .map((param: any) => ({
          value: param.bin,
          label: param.bin,
        }))
    : [];

  const handleConfirmUpdate = async () => {
    if (!selectedBin) {
      Swal.fire('Error', 'No hay servicio seleccionado válido.', 'error');
      setShowModal(false);
      return;
    }

    setShowModal(false);
    setSubmitting(true);

    // Construir payload de actualización (solo campos editables)
    const updates = {
      binActualizado: formData.binActualizado, // si aplica en tu API
    };

    try {
      // Se asume que updateTarifaGeneral acepta (tarifa_id, updates)
      await updateBinAExcluir({bin_id: selectedBin.bin_id, 
        bin: formData.binActualizado});
      Swal.fire(
        'Actualización exitosa',
        `El bin "${formData.bin}" fue actualizado.`,
        'success'
      );
      setFormData({
        bin: '',
        binActualizado: '',
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
      <h2 className={styles.operationTitle}>Actualización de Bines a excluir en Gastos de Cobranza</h2>

      {loading && <LoadingSpinner size="lg" color="#0d6efd" text="Cargando bines..." />}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <FormSelect
              label="BIN:"
              name="bin"
              value={formData.bin}
              options={binOptions}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <FormInput
              label="BIN:"
              name="binActualizado"
              value={formData.binActualizado}
              placeholder="Ingrese el nuevo valor del bin..."
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>
          <div className={styles.buttonContainer}>
            <RegisterButton type="submit" disabled={submitting}>
              {submitting ? 'Actualizando...' : 'Actualizar Parámetro'}
            </RegisterButton>
          </div>
        </form>
      )}

      <ConfirmationModal
        isOpen={showModal}
        title="Confirmar actualización"
        message={`¿Deseas actualizar el bin: "${formData.bin}" al nuevo valor "${formData.binActualizado}"?`}
        confirmText="Sí, actualizar"
        cancelText="Cancelar"
        onConfirm={handleConfirmUpdate}
        onCancel={() => setShowModal(false)}
        isSubmitting={submitting}
      />
    </div>
  );
}

export default function BinesAExcluir() {
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
      <h1 className={styles.pageTitle}>Bines a excluir en Gastos de Cobranza</h1>
      <div className={styles.tabsContainer}>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {activeTab === 'Consulta' && <ConsultaBinesAExcluir refreshKey={refreshKey} />}
      {activeTab === 'Ingreso' && <IngresoBinesAExcluir onRefresh={() => setRefreshKey(prev => prev + 1)} />}
      {activeTab === 'Eliminación' && <EliminacionBinesAExcluir refreshKey={refreshKey} onRefresh={() => setRefreshKey(prev => prev + 1)} />}
      {activeTab === 'Actualización' && (<ActualizacionBinesAExcluir refreshKey={refreshKey} onRefresh={() => setRefreshKey(prev => prev + 1)}/>
)}
    </div>
  );
}
