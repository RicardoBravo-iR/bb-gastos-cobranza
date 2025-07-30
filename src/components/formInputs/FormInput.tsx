import React from 'react';
import { InputContainer, Label, Input } from './FormInput.styles';

type Props = {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
};

const FormInput: React.FC<Props> = ({ label, name, value, placeholder, onChange, required = false, autoComplete }) => {
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
        autoComplete={autoComplete}
      />
    </InputContainer>
  );
};

export default FormInput;
