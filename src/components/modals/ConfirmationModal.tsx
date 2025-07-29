// components/modals/ConfirmationModal.tsx
'use client';

import React from 'react';
import {ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalActions, ConfirmButton, CancelButton,} from './ConfirmationModal.styles';

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title = 'Confirmación',
  message = '¿Estás seguro de continuar con esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalActions>
          <ConfirmButton onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Procesando...' : confirmText}
          </ConfirmButton>
          <CancelButton onClick={onCancel}>{cancelText}</CancelButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmationModal;
