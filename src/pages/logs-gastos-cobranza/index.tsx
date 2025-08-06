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
