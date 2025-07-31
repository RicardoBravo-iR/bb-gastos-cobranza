import styled from 'styled-components';

export const TableWrapper = styled.div`
  display: flex;
  justify-content: center;
  /*overflow-x: auto;*/
  padding: 1rem;
`;

export const StyledTable = styled.table`
  border-collapse: collapse;
  width: auto;
  min-width: 400px;
  background-color: white; /* Fondo blanco para toda la tabla */
`;

export const TableHeader = styled.th`
  padding: 6px 6px;
  border: 1px solid #e0e0e0;
  text-align: center;
  background-color: white; /* Cambiado de gris a blanco */
  color: #333;
  font-weight: 600;
  white-space: nowrap;
`;

export const TableRow = styled.tr`
  background-color: white; /* Asegura fondo blanco para todas las filas */

  &:nth-child(even) {
    background-color: white; /* Elimina la alternancia de color */
  }
`;

export const TableCell = styled.td`
  padding: 6px 6px;
  border: 1px solid #e0e0e0;
  text-align: center;
  color: #333;
  white-space: nowrap;
  background-color: white;
  max-width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  gap: 1.5rem;
  width: 100%;
`;

export const PageButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #008f9f;
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const PageInfo = styled.span`
  font-weight: 500;
  color: #333;
`;
