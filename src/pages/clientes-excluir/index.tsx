'use client';

import { getClientesAExcluir, ClienteAExcluir } from "@/api/get-clientes-excluir";
import { postClienteAExcluir } from "@/api/post-clientes-excluir";
import { deleteClienteAExcluir } from "@/api/delete-clientes-excluir";
import { updateClienteAExcluir } from "@/api/update-clientes-excluir";
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
import FilteredSearchInput from "@/components/inputs/filteredSearchInput/FilteredSearchInput";
import LoadingSpinner from '@/components/loading/loadingSpinner/loadingSpinner';
import Swal from 'sweetalert2';

function ConsultaClientesAExcluir({ refreshKey }: { refreshKey: number }) {
  const { data, loading, error } = getClientesAExcluir(refreshKey);
  const [filter, setFilter] = useState('');

  const rows = Array.isArray(data)
  ? [...data].sort((a, b) => a.identificacion.localeCompare(b.identificacion))
  : [];

  const filteredRows = rows.filter((param) =>
    param.identificacion.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.operationTitle}>Consulta de Clientes a excluir en Gastos de Cobranza</h2>

      {/* Filtro */}
      <form className={styles.filterContainer}>
        <FilteredInput
          label="IDENTIFICACIÓN:"
          id="paramFilter"
          value={filter}
          placeholder="Buscar identificación..."
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className={styles.exportButtonContainer}>
          <ExcelExport
            data={data}
            fileName="clientes-excluir.xlsx"
            label="Exportar Excel"
            sortBy="identificacion"
            direction="asc"
            columnOrder={['identificacion', 'fechaVigenciaHasta']}
            columnHeaders={{identificacion: 'Identificación', fechaVigenciaHasta: 'Fecha Vigencia Hasta'}}
          />
        </div>
      </form>

      {/* Tabla */}
      {loading && <LoadingSpinner size="lg" color="#0d6efd" text="Cargando clientes a excluir..." />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <Table
          data={filteredRows}
          visibleColumns={['identificacion', 'fechaVigenciaHasta']}
          headerLabels={{identificacion: 'Identificación', fechaVigenciaHasta: 'Fecha Vigencia Hasta'}}
        />
      )}
    </div>
  );
}

function IngresoClientesAExcluir({ onRefresh }: { onRefresh: () => void }) {
  const [formData, setFormData] = useState({
    identificacion: '',
    fechaVigenciaHasta: ''
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
      await postClienteAExcluir(id, formData.fechaVigenciaHasta, formData.identificacion);

      Swal.fire({
        title: "Cliente correctamente ingresado!",
        icon: "success",
        draggable: true
      });
      setFormData({
        identificacion: '',
        fechaVigenciaHasta: '',
      });
      onRefresh();
    } catch (err) {
      Swal.fire({
        title: "Error al ingresar cliente!",
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
      <h2 className={styles.operationTitle}>Ingreso de Clientes a excluir en Gastos de Cobranza</h2>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <FormInput
            label="IDENTIFICACION:"
            name="identificacion"
            value={formData.identificacion}
            placeholder="Ingrese identificación a excluir..."
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
        <div className={styles.formGroup}>
          <FormInput
            label="FECHA VIGENCIA HASTA:"
            name="fechaVigenciaHasta"
            value={formData.fechaVigenciaHasta}
            placeholder="Ingrese fecha de vigencia hasta..."
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
        <div className={styles.buttonContainer}>
          <RegisterButton type="submit">Ingresar Cliente a excluir</RegisterButton>
        </div>
      </form>

      {/* Modal de Confirmación */}
      <ConfirmationModal
        isOpen={showModal}
        title="Confirmar ingreso"
        confirmText="Sí, ingresar"
        message={`¿Deseas ingresar a la identificación "${formData.identificacion}" con la fecha de vigencia hasta:\n
          Fecha Vigencia Hasta: "${formData.fechaVigenciaHasta}"\n?`}
        cancelText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
        isSubmitting={loading}
      />
    </div>
  );
}

function EliminacionClientesAExcluir({
  refreshKey,
  onRefresh,
}: {
  refreshKey: number;
  onRefresh: () => void;
}) {
  const { data, loading: loadingData, error } = getClientesAExcluir(refreshKey);

  const [formData, setFormData] = useState({
    identificacion: "",
    fechaVigenciaHasta: "",
  });
  const [selectedCliente, setSelectedCliente] = useState<ClienteAExcluir | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCliente) {
      Swal.fire("Error", "No se ha seleccionado un cliente válido.", "error");
      return;
    }
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCliente) {
      Swal.fire("Error", "No se encontró el cliente seleccionado.", "error");
      setShowModal(false);
      return;
    }

    setLoading(true);
    try {
      await deleteClienteAExcluir(selectedCliente.cliente_id); // usa client_id

      Swal.fire({
        title: "Cliente eliminado correctamente",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
      });

      setFormData({
        identificacion: "",
        fechaVigenciaHasta: "",
      });
      setSelectedCliente(null);
      onRefresh();
    } catch (err: any) {
      Swal.fire({
        title: "Error al eliminar cliente",
        icon: "error",
        text: err.message || "",
      });
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  // Mantener valor actual para el modal
  const valorActual = {
    identificacion: selectedCliente?.identificacion ?? "",
    fechaVigenciaHasta: selectedCliente?.fechaVigenciaHasta ?? "",
  };

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.operationTitle}>
        Eliminación de Clientes a excluir en Gastos de Cobranza
      </h2>

      {loadingData && (
        <LoadingSpinner size="lg" color="#0d6efd" text="Cargando clientes a excluir..." />
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loadingData && !error && (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <FilteredSearchInput
              label="IDENTIFICACIÓN:"
              placeholder="Busca por identificación..."
              refreshKey={refreshKey}
              filterBy="identificacion"
              onSelect={(cliente) => {
                setSelectedCliente(cliente);
                setFormData({
                  identificacion: cliente.identificacion,
                  fechaVigenciaHasta: cliente.fechaVigenciaHasta,
                });
              }}
              minCharsToSearch={1}
            />
          </div>
          <div className={styles.buttonContainer}>
            <DeleteButton type="submit">Eliminar Cliente</DeleteButton>
          </div>
        </form>
      )}

      <ConfirmationModal
        isOpen={showModal}
        title="Confirmar eliminación"
        message={`¿Deseas eliminar al cliente con identificacion "${valorActual.identificacion}" y con fecha de vigencia: "${valorActual.fechaVigenciaHasta}"?`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowModal(false)}
        isSubmitting={loading}
      />
    </div>
  );
}

function ActualizacionClientesAExcluir({
  refreshKey,
  onRefresh,
}: {
  refreshKey: number;
  onRefresh: () => void;
}) {
  const { data: clientes, loading, error } = getClientesAExcluir(refreshKey);
  const [formData, setFormData] = useState({
    identificacion: "",
    identificacionCliente: "",
    fechaVigenciaHasta: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteAExcluir | null>(null);

  // Valores actuales para mostrar en el modal
  const valorActual = {
    identificacion: selectedCliente?.identificacion ?? "",
    fechaVigenciaHasta: selectedCliente?.fechaVigenciaHasta ?? "",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.identificacion || !formData.fechaVigenciaHasta) {
      Swal.fire("Campos requeridos", "Debes completar todos campos.", "warning");
      return;
    }

    if (!selectedCliente) {
      Swal.fire(
        "Cliente no encontrado",
        `El cliente con identificación "${formData.identificacion}" no existe.`,
        "error"
      );
      return;
    }

    setShowModal(true);
  };

  const handleConfirmUpdate = async () => {
    if (!selectedCliente) {
      Swal.fire("Error", "No hay cliente seleccionado válido.", "error");
      setShowModal(false);
      return;
    }

    setShowModal(false);
    setSubmitting(true);

    try {
      await updateClienteAExcluir({
        cliente_id: selectedCliente.cliente_id,
        identificacion: formData.identificacionCliente,
        fechaVigenciaHasta: formData.fechaVigenciaHasta,
      });

      Swal.fire(
        "Actualización exitosa",
        `El cliente con identificación "${formData.identificacion}" fue actualizado.`,
        "success"
      );

      setFormData({
        identificacion: "",
        identificacionCliente: "",
        fechaVigenciaHasta: "",
      });
      setSelectedCliente(null);
      onRefresh();
    } catch (err: any) {
      Swal.fire("Error", err.message || "Ocurrió un error al actualizar.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.operationTitle}>
        Actualización de Clientes a excluir en Gastos de Cobranza
      </h2>

      {loading && (
        <LoadingSpinner size="lg" color="#0d6efd" text="Cargando parámetros..." />
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <FilteredSearchInput
              label="IDENTIFICACION:"
              placeholder="Busca por identificación..."
              refreshKey={refreshKey}
              filterBy="identificacion"
              onSelect={(cliente) => {
                setSelectedCliente(cliente);
                setFormData((prev) => ({
                  ...prev,
                  identificacion: cliente.identificacion,
                  fechaVigenciaHasta: cliente.fechaVigenciaHasta,
                }));
              }}
              minCharsToSearch={1}
            />
          </div>

          <div className={styles.formGroup}>
            <FormInput
              label="NUEVA IDENTIFICACION:"
              name="identificacionCliente"
              value={formData.identificacionCliente}
              placeholder="Ingrese el nuevo valor de identificación del cliente..."
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>

          <div className={styles.formGroup}>
            <FormInput
              label="FECHA VIGENCIA HASTA:"
              name="fechaVigenciaHasta"
              value={formData.fechaVigenciaHasta}
              placeholder="Ingrese el nuevo valor de Fecha Vigencia Hasta..."
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>

          <div className={styles.buttonContainer}>
            <RegisterButton type="submit" disabled={submitting}>
              {submitting ? "Actualizando..." : "Actualizar Cliente"}
            </RegisterButton>
          </div>
        </form>
      )}

      <ConfirmationModal
        isOpen={showModal}
        title="Confirmar actualización"
        message={`¿Deseas actualizar al cliente con identificación "${valorActual.identificacion}" con valores actuales:\nIdentificación: "${valorActual.identificacion}",\nFecha Vigencia Hasta: "${valorActual.fechaVigenciaHasta}"\na los nuevos valores:\nIdentificación: "${formData.identificacionCliente}",\nFecha Vigencia Hasta: "${formData.fechaVigenciaHasta}"?`}
        confirmText="Sí, actualizar"
        cancelText="Cancelar"
        onConfirm={handleConfirmUpdate}
        onCancel={() => setShowModal(false)}
        isSubmitting={submitting}
      />
    </div>
  );
}

export default function TarifasGenerales() {
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
      <h1 className={styles.pageTitle}>Clientes a excluir en Gastos de Cobranza</h1>
      <div className={styles.tabsContainer}>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {activeTab === 'Consulta' && <ConsultaClientesAExcluir refreshKey={refreshKey} />}
      {activeTab === 'Ingreso' && <IngresoClientesAExcluir onRefresh={() => setRefreshKey(prev => prev + 1)} />}
      {activeTab === 'Eliminación' && <EliminacionClientesAExcluir refreshKey={refreshKey} onRefresh={() => setRefreshKey(prev => prev + 1)} />}
      {activeTab === 'Actualización' && (<ActualizacionClientesAExcluir refreshKey={refreshKey} onRefresh={() => setRefreshKey(prev => prev + 1)}/>
)}
    </div>
  );
}
