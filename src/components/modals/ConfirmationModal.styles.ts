// components/modals/ConfirmationModal.styles.ts
'use client';

import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

export const ModalHeader = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.3rem;
`;

export const ModalBody = styled.p`
  margin-bottom: 1.5rem;
  font-size: 1rem;
  color: #333;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

export const ConfirmButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #94d3a2;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  background-color: #dc3545;
  color: white;;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #c82333;
  }
`;
