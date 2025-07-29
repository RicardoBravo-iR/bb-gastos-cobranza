import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ExportButtonContainer, ExportButton } from './ExcelExport.styles';

type Props = {
  data: Record<string, any>[];  // Datos en formato JSON
  fileName?: string;            // Nombre opcional del archivo
  label?: string;               // Texto opcional del botón
};

const ExcelExport: React.FC<Props> = ({ data, fileName = 'results.xlsx', label = 'Exportar Excel' }) => {
  const exportAllToExcel = () => {
    if (!data || data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Parámetros');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, fileName);
  };

  return (
    <ExportButtonContainer>
      <ExportButton type="button" onClick={exportAllToExcel}>
        {label}
      </ExportButton>
    </ExportButtonContainer>
  );
};

export default ExcelExport;
