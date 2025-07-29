'use client';

import { getParametrosGenerales } from "@/api/get-parametros-generales";
import { postParametroGeneral } from "@/api/post-parametros-generales";
import React, { useState, useEffect } from 'react';
import Tabs from '@/components/tabs/Tabs';
import styles from '@/styles/ParametrosGenerales.module.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import Table from '@/components/tables/Table';
import Swal from 'sweetalert2';

function ConsultaParametros() {
  const { data, loading, error } = getParametrosGenerales();
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
  const exportAllToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Parámetros');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'parametros-generales-completo.xlsx');
  };

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.operationTitle}>Consulta de Parámetros Generales</h2>

      {/* Filtro */}
      <form className={styles.filterContainer}>
        <label htmlFor="paramFilter" className={styles.filterLabel}>PARÁMETRO:</label>
        <input
          id="paramFilter"
          type="text"
          autoComplete="off"
          placeholder="Buscar parámetro..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.filterInput}
        />
        <div className={styles.exportButtonContainer}>
          <button onClick={exportAllToExcel} type="button" className={styles.exportButton}>
            Exportar Excel
          </button>
        </div>
      </form>

      {/* Tabla */}
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <Table data={filteredRows} />
      )}
    </div>
  );
}

function IngresoParametros() {
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
    } catch (err) {
      alert("Error al ingresar el parámetro.");
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
          <div className={styles.formInputContainer}>
            <label className={styles.formLabel}>PARÁMETRO:</label>
            <input
              type="text"
              name="parametro"
              value={formData.parametro}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <div className={styles.formInputContainer}>
            <label className={styles.formLabel}>VALOR:</label>
            <input
              type="text"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton}>Ingresar Parámetro</button>
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

// Componente para la pestaña de Edición
function EdicionParametros() {
  const { data, loading, error } = getParametrosGenerales();
  const rows = Array.isArray(data) ? data : [];

  return (
    <div className={styles.pageContainer}>
      <h2>Edición de Parámetros Generales</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th className={styles.tableHeaderCell}>Parámetro</th>
                <th className={styles.tableHeaderCell}>Valor</th>
                <th className={styles.tableHeaderCell}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className={styles.noDataCell}>No hay datos para mostrar</td>
                </tr>
              ) : (
                rows.map((param, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? styles.tableRow : styles.tableRowAlternate}>
                    <td className={styles.tableCell}>{param.parametro}</td>
                    <td className={styles.tableCell}>{param.valor}</td>
                    <td className={styles.tableCellCenter}>
                      <button className={`${styles.actionButton} ${styles.editButton}`}>Editar</button>
                      <button className={`${styles.actionButton} ${styles.deleteButton}`}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Componente para la pestaña de Configuración
function ConfiguracionParametros() {
  return (
    <div className={styles.pageContainer}>
      <h2>Configuración de Parámetros Generales</h2>
      <p>Aquí puedes configurar opciones adicionales para el manejo de parámetros.</p>
      <div className={styles.configContainer}>
        <h3>Opciones de Configuración</h3>
        <ul className={styles.configList}>
          <li className={styles.configListItem}>Configuración de paginación</li>
          <li className={styles.configListItem}>Configuración de filtros</li>
          <li className={styles.configListItem}>Configuración de exportación</li>
          <li className={styles.configListItem}>Configuración de permisos</li>
        </ul>
      </div>
    </div>
  );
}

export default function ParametrosGenerales() {
  const [activeTab, setActiveTab] = useState('Consulta');
  const [isClient, setIsClient] = useState(false);
  const tabs = ['Consulta', 'Ingreso', 'Edición', 'Configuración'];

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className={styles.loadingContainer}>Cargando...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Parámetros Generales de Gastos de Cobranza</h1>
      <div className={styles.tabsContainer}>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {activeTab === 'Consulta' && <ConsultaParametros />}
      {activeTab === 'Ingreso' && <IngresoParametros />}
      {activeTab === 'Edición' && <EdicionParametros />}
      {activeTab === 'Configuración' && <ConfiguracionParametros />}
    </div>
  );
}
