// src/components/RegisterButton/RegisterButton.tsx
import React from 'react';
import { StyledButton } from './RegisterButton.styles';

type Props = {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
};

const RegisterButton: React.FC<Props> = ({ onClick, type = 'button', children }) => {
  return (
    <StyledButton type={type} onClick={onClick}>
      {children}
    </StyledButton>
  );
};

export default RegisterButton;
