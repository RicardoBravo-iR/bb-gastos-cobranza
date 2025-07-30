import styled from 'styled-components';

export const ExportButtonContainer = styled.div`
  text-align: center;
`;

export const ExportButton = styled.button`
  background-color: #217346;
  color: white;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #1b5e3b;
  }
`;

export const Icon = styled.i`
  font-size: 1.1rem;
`;
