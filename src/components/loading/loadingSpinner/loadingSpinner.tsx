import React from 'react';
import { SpinnerContainer, StyledSpinner } from './loadingSpinner.styles';

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = '#008F9F',
  text = 'Cargando...',
}) => {
  return (
    <SpinnerContainer>
      <StyledSpinner
        className="spinner-border"
        role="status"
        $size={size}
        $color={color}
      />
      <span>{text}</span>
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
