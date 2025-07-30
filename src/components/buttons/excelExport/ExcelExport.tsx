import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ExportButtonContainer, ExportButton, Icon } from './ExcelExport.styles';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Asegura que los íconos estén disponibles

type Props = {
  data: Record<string, any>[];
  fileName?: string;
  label?: string;
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
        <Icon className="bi bi-file-earmark-excel" />
        {label}
      </ExportButton>
    </ExportButtonContainer>
  );
};

export default ExcelExport;
