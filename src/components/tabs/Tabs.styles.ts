import styled from 'styled-components';

export const TabsContainer = styled.div`
  display: flex;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: #ffffff;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  width: fit-content;
`;

export const TabButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: ${props => props.isActive ? '600' : '500'};
  line-height: 1rem;
  color: ${props => props.isActive ? '#FFFFFF' : '#080F0D'};
  background-color: ${props => props.isActive ? '#008F9F' : '#F3EBEE'};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  min-width: 120px;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  /* Border radius para el primer tab */
  &:first-child {
    border-top-left-radius: 0.75rem;
    border-bottom-left-radius: 0.75rem;
  }

  /* Border radius para el último tab */
  &:last-child {
    border-top-right-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
  }

  &:hover {
    background-color: ${props => props.isActive ? '#007A87' : '#E8DDE1'};
    color: ${props => props.isActive ? '#FFFFFF' : '#080F0D'};
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 143, 159, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  /* Indicador de tab activo */
  ${props => props.isActive && `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #FFFFFF;
      border-radius: 1px;
    }
  `}

  /* Efecto de sombra para tab activo */
  ${props => props.isActive && `
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 1;
  `}
`;

export const TabContent = styled.div`
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 0 0 0.5rem 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

export const TabIcon = styled.span`
  margin-right: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
`;

export const TabBadge = styled.span<{ isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  padding: 0.125rem 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  border-radius: 9999px;
  background-color: ${props => props.isActive ? 'rgba(255, 255, 255, 0.2)' : '#e5e7eb'};
  color: ${props => props.isActive ? '#FFFFFF' : '#080F0D'};
  min-width: 1.25rem;
  height: 1.25rem;
`; 