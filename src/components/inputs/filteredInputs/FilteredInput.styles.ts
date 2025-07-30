import styled from 'styled-components';

export const InputGroup = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    margin-top: 2rem;
    gap: 1rem;
    min-width: 75%;
`;

export const Label = styled.label`
  font-size: 1.25rem;
  font-weight: bold;
  color: #008F9F;
  font-family: inherit;
`;

export const Input = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
  flex: 1;
`;