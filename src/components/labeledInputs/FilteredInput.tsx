import React from 'react';
import { InputGroup, Label, Input } from './FilteredInput.styles';

type Props = {
  label: string;
  id: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FilteredInput: React.FC<Props> = ({ label, id, value, placeholder, onChange }) => {
  return (
    <InputGroup>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        autoComplete="off"
      />
    </InputGroup>
  );
};

export default FilteredInput;
