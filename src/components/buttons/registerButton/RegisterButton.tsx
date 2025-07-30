// src/components/RegisterButton/RegisterButton.tsx
import React from 'react';
import { StyledButton } from './RegisterButton.styles';

type Props = {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  disabled?: boolean; // <-- AÑADIDO
};

const RegisterButton: React.FC<Props> = ({ onClick, type = 'button', children, disabled = false }) => {
  return (
    <StyledButton type={type} onClick={onClick} disabled={disabled}>
      {children}
    </StyledButton>
  );
};

export default RegisterButton;
