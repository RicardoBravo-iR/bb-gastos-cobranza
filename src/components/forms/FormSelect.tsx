import { getCatalogoCategoria } from "@/api/types/catalogo-categoria";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface Option {
  label: string;
  value: string;
}

interface FormSelectProps {
  id: string;
  label: string;
  register: UseFormRegisterReturn;
  options: getCatalogoCategoria[];
  defaultOption?: string;
  error?: FieldError;
  disabled?: boolean;
  className?: string;
  selectClassName?: string;
  labelClassName?: string;
  eventHandlers?: {
    [key: string]: (e: React.SyntheticEvent) => void;
  }
}

export default function FormSelect({ id, label, register, options, defaultOption, error, disabled=false, className, labelClassName, selectClassName }: FormSelectProps) {
  return (
    <div className={className ?? ""}>
      <label htmlFor={id} className={`form-label ${labelClassName ?? ""}`}>{label}</label>
      <select
        id={id}
        className={`form-select ${error ? "is-invalid" : ""} ${selectClassName ?? ""}`}
        {...register}
        disabled={disabled}
      >
        {defaultOption && <option value="">{defaultOption}</option>}
        {options.map((opt) => (
          <option key={opt.s_valor} value={opt.s_nombre}>
            {opt.s_descripcion}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
  );
}
