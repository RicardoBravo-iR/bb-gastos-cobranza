// filteredSearchInput.styles.ts
import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const InputGroup = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 3fr;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  font-size: 1.25rem;
  font-weight: bold;
  color: #008f9f;
  font-family: inherit;
`;

export const Input = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
  flex: 1;
  width: 100%;
  box-sizing: border-box;
`;

export const Dropdown = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 240px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

export const Item = styled.li<{ highlighted?: boolean }>`
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  background: ${({ highlighted }) => (highlighted ? '#f0f8fa' : 'white')};
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #eef7fa;
  }
`;

export const NoResults = styled.div`
  padding: 0.75rem;
  color: #666;
  font-size: 0.9rem;
`;
