import React from 'react';
import { InputContainer, Label, Input } from './FormInput.styles';

type Props = {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

const FormInput: React.FC<Props> = ({ label, name, value, placeholder, onChange, required = false }) => {
  return (
    <InputContainer>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
      />
    </InputContainer>
  );
};

export default FormInput;
