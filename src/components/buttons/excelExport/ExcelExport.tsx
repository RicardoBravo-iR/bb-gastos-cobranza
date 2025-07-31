import React, { useMemo } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ExportButtonContainer, ExportButton, Icon } from './ExcelExport.styles';
import 'bootstrap-icons/font/bootstrap-icons.css';

type Props = {
  data: Record<string, any>[];
  fileName?: string;
  label?: string;
  sortBy?: string;
  direction?: 'asc' | 'desc';
  columnOrder?: string[]; // qué columnas incluir y en qué orden
  columnHeaders?: Record<string, string>; // renombrar para el Excel
};

const ExcelExport: React.FC<Props> = ({
  data,
  fileName = 'results.xlsx',
  label = 'Exportar Excel',
  sortBy,
  direction = 'asc',
  columnOrder,
  columnHeaders = {},
}) => {
  // Ordenar filas si se pide
  const sortedData = useMemo(() => {
    if (!sortBy) return [...data];
    const copy = [...data];
    copy.sort((a, b) => {
      const va = a[sortBy];
      const vb = b[sortBy];
      if (va == null && vb == null) return 0;
      if (va == null) return direction === 'asc' ? -1 : 1;
      if (vb == null) return direction === 'asc' ? 1 : -1;

      if (typeof va === 'number' && typeof vb === 'number') {
        return direction === 'asc' ? va - vb : vb - va;
      }

      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      if (sa < sb) return direction === 'asc' ? -1 : 1;
      if (sa > sb) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [data, sortBy, direction]);

  // Proyectar columnas según columnOrder y renombrar keys para el Excel
  const preparedData = useMemo(() => {
    if (!sortedData) return [];
    return sortedData.map((row) => {
      const target: Record<string, any> = {};
      const keys = columnOrder && columnOrder.length > 0
        ? columnOrder.filter((k) => k in row)
        : Object.keys(row);
      keys.forEach((key) => {
        const headerName = columnHeaders[key] || key;
        target[headerName] = row[key];
      });
      return target;
    });
  }, [sortedData, columnOrder, columnHeaders]);

  const exportAllToExcel = () => {
    if (!preparedData || preparedData.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(preparedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Parámetros');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, fileName);
  };

  return (
    <ExportButtonContainer>
      <ExportButton type="button" onClick={exportAllToExcel}>
        <Icon className="bi bi-file-earmark-excel" />
        {label}
      </ExportButton>
    </ExportButtonContainer>
  );
};

export default ExcelExport;
