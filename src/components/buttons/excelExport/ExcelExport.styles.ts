import styled from 'styled-components';

export const ExportButtonContainer = styled.div`
  text-align: center;
`;

export const ExportButton = styled.button`
  background-color: #217346; /* verde tipo Excel */
  color: white;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1b5e3b;
  }
`;