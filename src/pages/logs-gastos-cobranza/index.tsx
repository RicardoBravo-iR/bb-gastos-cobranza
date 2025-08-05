'use client';

import { getParametrosGenerales } from "@/api/get-parametros-generales";
import { postParametroGeneral } from "@/api/post-parametros-generales";
import React, { useState, useEffect } from 'react';
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

function ConsultaParametros({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = getParametrosGenerales(refreshKey);
  const [filter, setFilter] = useState('');

  const rows = Array.isArray(data)
  ? [...data].sort((a, b) => a.parametro.localeCompare(b.parametro))
  : [];

  const filteredRows = rows.filter((param) =>
    param.parametro.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.operationTitle}>Consulta de Parámetros Generales de Gastos de Cobranza</h2>

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
          <ExcelExport
            data={data}
            fileName="parametros-gastos-cobranza.xlsx"
            label="Exportar Excel"
            sortBy="parametro"
            direction="asc"
            columnOrder={['parametro', 'valor']}
            columnHeaders={{ parametro: 'parametro', valor: 'valor' }}
          />
        </div>
      </form>

      {/* Tabla */}
      {loading && <LoadingSpinner size="lg" color="#0d6efd" text="Cargando parámetros..." />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <Table
          data={filteredRows}
          visibleColumns={['parametro', 'valor']}
          headerLabels={{ parametro: 'Nemónico', valor: 'Valor' }}
        />
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
      <h2 className={styles.operationTitle}>Ingreso de Parámetros Generales de Gastos de Cobranza</h2>
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



export default function LogsGastosCobranza() {
  const [activeTab, setActiveTab] = useState('Modificaciones');
  const [isClient, setIsClient] = useState(false);
  const tabs = ['Modificaciones', 'Ejecuciones'];
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
      <h1 className={styles.pageTitle}>Logs de Auditoría de Gastos de Cobranza</h1>
      <div className={styles.tabsContainer}>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {activeTab === 'Modificaciones' && <ConsultaParametros refreshKey={refreshKey} />}
      {activeTab === 'Ejecuciones' && <ConsultaParametros refreshKey={refreshKey} />}
    </div>
  );
}
