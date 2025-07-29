'use client';

import { getParametrosGenerales } from "@/api/get-parametros-generales";
import { postParametroGeneral } from "@/api/post-parametros-generales";
import React, { useState, useEffect } from 'react';
import Tabs from '@/components/tabs/Tabs';
import styles from '@/styles/ParametrosGenerales.module.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Componente para la pestaña de Consulta
function ConsultaParametros() {
  const { data, loading, error } = getParametrosGenerales();
  const [filter, setFilter] = useState(""); // Nuevo estado para el filtro

  const rows = Array.isArray(data) ? data : [];

  const filteredRows = rows.filter((param) =>
    param.parametro.toLowerCase().includes(filter.toLowerCase())
  );

  //Exporta información filtrada
  const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(filteredRows); // exporta lo que se ve (filtrado)
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Parámetros");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(dataBlob, "parametros-generales.xlsx");
};

// Exporta todos los datos
const exportAllToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Parámetros");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(dataBlob, "parametros-generales-completo.xlsx");
};

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.operationTitle}>Consulta de Parámetros Generales</h2>
      {/* Formulario de filtro */}
      <form className={styles.filterContainer}>
        <label htmlFor="paramFilter" className={styles.filterLabel}>PARÁMETRO:</label>
        <input
          id="paramFilter"
          type="text"
          placeholder="Buscar parámetro..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.filterInput}
        />
        <div className={styles.exportButtonContainer}>
          {/*<button onClick={exportToExcel} className={styles.exportButton}>
            Exportar Excel (filtrado)
          </button>*/}
          <button onClick={exportAllToExcel} className={styles.exportButton}>
            Exportar Excel
          </button>
        </div>
      </form>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th className={styles.tableHeaderCell}>Parámetro</th>
                <th className={styles.tableHeaderCell}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={2} className={styles.noDataCell}>No hay datos que coincidan</td>
                </tr>
              ) : (
                filteredRows.map((param, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? styles.tableRow : styles.tableRowAlternate}>
                    <td className={styles.tableCell}>{param.parametro}</td>
                    <td className={styles.tableCell}>{param.valor}</td>
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

// Componente para la pestaña de Ingreso
function IngresoParametros() {
  const [formData, setFormData] = useState({ parametro: '', valor: '' });
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true); // Muestra el modal antes de enviar
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await postParametroGeneral(formData.parametro, formData.valor);
      alert("✅ Parámetro ingresado correctamente.");
      setFormData({ parametro: '', valor: '' }); // Limpia el formulario
    } catch (error: any) {
      alert("❌ Error al ingresar el parámetro:\n" + error.message);
    } finally {
      setShowModal(false);
      setIsSubmitting(false);
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

      {/* Modal de confirmación */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '2rem',
            borderRadius: '8px', maxWidth: '400px', textAlign: 'center'
          }}>
            <p>¿Deseas ingresar el parámetro <strong>{formData.parametro}</strong> con el valor <strong>{formData.valor}</strong>?</p>
            <div style={{ marginTop: '1.5rem' }}>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className={styles.confirmButton}
                style={{ marginRight: '1rem' }}
              >
                {isSubmitting ? 'Enviando...' : 'Confirmar'}
              </button>
              <button onClick={() => setShowModal(false)} className={styles.deleteButton}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
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
