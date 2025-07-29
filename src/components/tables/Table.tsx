import React, { useState, useMemo } from 'react';
import {
  TableWrapper,
  StyledTable,
  TableHeader,
  TableRow,
  TableCell,
  PaginationContainer,
  PageButton,
  PageInfo
} from './Table.styles';

type Props = {
  data: Record<string, any>[];
  rowsPerPage?: number;
  noDataText?: string;
};

const Table: React.FC<Props> = ({
  data,
  rowsPerPage = 10,
  noDataText = 'No hay datos disponibles',
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [currentPage, data, rowsPerPage]);

  const headers = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <>
      <TableWrapper>
        <StyledTable>
          <thead>
            <TableRow>
              {headers.map((header) => (
                <TableHeader key={header}>{header.toUpperCase()}</TableHeader>
              ))}
            </TableRow>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headers.length} style={{ textAlign: 'center' }}>
                  {noDataText}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell key={header}>{row[header]}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </tbody>
        </StyledTable>
      </TableWrapper>

      {totalPages > 1 && (
        <PaginationContainer>
          <PageButton onClick={handlePrevious} disabled={currentPage === 1}>
            Anterior
          </PageButton>

          <PageInfo>
            Página {currentPage} de {totalPages}
          </PageInfo>

          <PageButton onClick={handleNext} disabled={currentPage === totalPages}>
            Siguiente
          </PageButton>
        </PaginationContainer>
      )}
    </>
  );
};

export default Table;
