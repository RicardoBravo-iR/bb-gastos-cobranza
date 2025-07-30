// src/components/RegisterButton/RegisterButton.styles.ts
import styled from 'styled-components';

export const StyledButton = styled.button`
  background-color: #0d6efd;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:enabled {
    background-color: #0b5ed7;
  }

  &:disabled {
    background-color: #c0c0c0;
    cursor: not-allowed;
  }
`;
