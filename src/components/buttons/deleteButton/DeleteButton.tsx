import React from 'react';
import { StyledDeleteButton } from './DeleteButton.styles';

type Props = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
};

const DeleteButton: React.FC<Props> = ({ children, type = 'button', onClick, disabled }) => {
  return (
    <StyledDeleteButton type={type} onClick={onClick} disabled={disabled}>
      {children}
    </StyledDeleteButton>
  );
};

export default DeleteButton;
