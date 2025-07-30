import styled from 'styled-components';

export const SelectContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  font-size: 1.25rem;
  font-weight: bold;
  color: #008F9F;
  font-family: inherit;
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
`;
