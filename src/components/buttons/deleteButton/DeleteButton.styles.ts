import styled from 'styled-components';

export const StyledDeleteButton = styled.button`
  padding: 10px 20px;
  background-color: #dc3545; /* rojo tipo danger */
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #c82333;
  }

  &:disabled {
    background-color: #e6a5aa;
    cursor: not-allowed;
  }
`;
