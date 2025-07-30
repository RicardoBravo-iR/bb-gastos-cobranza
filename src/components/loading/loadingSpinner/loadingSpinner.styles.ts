import styled, { css } from 'styled-components';

export const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
  padding: 1rem;
`;

export const StyledSpinner = styled.div<{
  $size: 'sm' | 'md' | 'lg';
  $color: string;
}>`
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          width: 1rem;
          height: 1rem;
          border-width: 0.15em;
        `;
      case 'lg':
        return css`
          width: 3rem;
          height: 3rem;
          border-width: 0.3em;
        `;
      case 'md':
      default:
        return css`
          width: 2rem;
          height: 2rem;
          border-width: 0.25em;
        `;
    }
  }}

  color: ${({ $color }) => $color};
  border-color: ${({ $color }) => $color} transparent transparent transparent;
`;
