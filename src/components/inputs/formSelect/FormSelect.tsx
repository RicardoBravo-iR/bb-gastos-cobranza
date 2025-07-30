import React from 'react';
import { SelectContainer, Label, Select } from './FormSelect.styles';

type Props = {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
};

const FormSelect: React.FC<Props> = ({ label, name, value, options, onChange, required = false }) => {
  return (
    <SelectContainer>
      <Label htmlFor={name}>{label}</Label>
      <Select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">Seleccione una opción</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
    </SelectContainer>
  );
};

export default FormSelect;
