'use client';

import { getParametrosGenerales } from "@/api/get-parametros-generales";
import { postParametroGeneral } from "@/api/post-parametros-generales";
import { deleteParametrosGenerales } from "@/api/delete-parametros-generales";
import React, { useState, useEffect } from 'react';
import Tabs from '@/components/tabs/Tabs';
import styles from '@/styles/ParametrosGenerales.module.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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

function ConsultaParametros({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = getParametrosGenerales(refreshKey);
  const [filter, setFilter] = useState('');

  const rows = Array.isArray(data) ? data : [];

  const filteredRows = rows.filter((param) =>
    param.parametro.toLowerCase().includes(filter.toLowerCase())
  );

  //Exporta solo la data filtrada
  /*
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Parámetros');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'parametros-generales.xlsx');
  };
  */

  //Exporta toda la tabla
  /*
  const exportAllToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Parámetros');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'parametros-generales-completo.xlsx');
  };
  */

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.operationTitle}>Consulta de Parámetros Generales</h2>

      {/* Filtro */}
      <form className={styles.filterContainer}>
        <FilteredInput
          label="PARÁMETRO:"
          id="paramFilter"
          value={filter}
          placeholder="Buscar parámetro..."
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className={styles.exportButtonContainer}>
          <ExcelExport data={data} fileName="parametros-gastos-cobranza.xlsx" label="Exportar Excel" />
        </div>
      </form>

      {/* Tabla */}
      {loading && <LoadingSpinner size="lg" color="#0d6efd" text="Cargando datos..." />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <Table data={filteredRows} />
      )}
    </div>
  );
}

function IngresoParametros({ onRefresh }: { onRefresh: () => void }) {
  const [formData, setFormData] = useState({ parametro: '', valor: '' });
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
      await postParametroGeneral(formData.parametro, formData.valor);
      Swal.fire({
        title: "Parámetro correctamente ingresado!",
        icon: "success",
        draggable: true
      });
      setFormData({ parametro: '', valor: '' });
      onRefresh()
    } catch (err) {
      Swal.fire({
        title: "Error al ingresar parámetro!",
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
      <h2 className={styles.operationTitle}>Ingreso de Parámetros Generales</h2>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <FormInput
            label="PARÁMETRO:"
            name="parametro"
            value={formData.parametro}
            placeholder="Ingrese nemónico del parámetro..."
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
        <div className={styles.formGroup}>
          <FormInput
            label="VALOR:"
            name="valor"
            value={formData.valor}
            placeholder="Ingrese el valor del parámetro..."
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
        <div className={styles.buttonContainer}>
          <RegisterButton type="submit">Ingresar Parámetro</RegisterButton>
        </div>
      </form>

      {/* Modal de Confirmación */}
      <ConfirmationModal
        isOpen={showModal}
        title="Confirmar ingreso"
        message={`¿Deseas ingresar el parámetro "${formData.parametro}" con el valor "${formData.valor}"?`}
        confirmText="Sí, ingresar"
        cancelText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
        isSubmitting={loading}
      />
    </div>
  );
}

function EliminacionParametros({ refreshKey, onRefresh }: { refreshKey: number, onRefresh: () => void }) {
  const { data, loading: loadingData, error } = getParametrosGenerales(refreshKey);
  const [formData, setFormData] = useState({ parametro: '', valor: '' });
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
      await deleteParametrosGenerales(formData.parametro);

      Swal.fire({
        title: "Parámetro eliminado correctamente",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
      });

      setFormData({ parametro: '', valor: '' });
      onRefresh()
    } catch (err) {
      Swal.fire({
        title: "Error al eliminar el parámetro",
        icon: "error",
        text: (err as Error).message || "",
      });
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  // Preparar opciones para el combo
  const parametroOptions = Array.isArray(data)
    ? data.map((param: any) => ({
        value: param.parametro,
        label: param.parametro,
      }))
    : [];

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.operationTitle}>Eliminación de Parámetros Generales</h2>

      {loadingData && <LoadingSpinner size="lg" color="#0d6efd" text="Cargando datos..." />}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loadingData && !error && (
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
          <div className={styles.buttonContainer}>
            <DeleteButton onClick={() => setShowModal(true)}>Eliminar Parámetro</DeleteButton>
          </div>
        </form>
      )}

      <ConfirmationModal
        isOpen={showModal}
        title="Confirmar eliminación"
        message={`¿Deseas eliminar el parámetro "${formData.parametro}"?`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowModal(false)}
        isSubmitting={loading}
      />
    </div>
  );
}


function ActualizacionParametros() {
  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.operationTitle}>Actualización de Parámetros Generales</h2>
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
      <h1 className={styles.pageTitle}>Parámetros Generales de Gastos de Cobranza</h1>
      <div className={styles.tabsContainer}>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {activeTab === 'Consulta' && <ConsultaParametros refreshKey={refreshKey} />}
      {activeTab === 'Ingreso' && <IngresoParametros onRefresh={() => setRefreshKey(prev => prev + 1)} />}
      {activeTab === 'Eliminación' && <EliminacionParametros refreshKey={refreshKey} onRefresh={() => setRefreshKey(prev => prev + 1)} />}
      {activeTab === 'Actualización' && <ActualizacionParametros />}
    </div>
  );
}
