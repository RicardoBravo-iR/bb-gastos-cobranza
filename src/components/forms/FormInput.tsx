import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps {
  id: string;
  label: string;
  register: UseFormRegisterReturn;
  type?: string;
  error?: FieldError;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  autoComplete?: string;
  eventHandlers?: {
    [key: string]: (e: React.SyntheticEvent) => void;
  }
}

export default function FormInput({ 
  id, 
  label, 
  type="text", 
  register, 
  error, 
  disabled=false,
  className,
  inputClassName,
  labelClassName,
  eventHandlers = {},
  autoComplete,
 }: FormInputProps) {
  const { onChange: rhfOnChange, onBlur: rhfOnBlur, ...rest } = register!;

  return (
    <div className={`${className ?? ""}`}>
      <label htmlFor={id} className={`form-label ${labelClassName ?? ""}`}>{label}</label>
      <input 
        id={id} 
        type={type}
        {...rest}
        className={`form-control ${error ? "is-invalid" : ""} ${inputClassName ?? ""}`}
        disabled={disabled}
        autoComplete={autoComplete}
        onChange={(e) => {
          rhfOnChange(e);
          eventHandlers.onChange?.(e)
        }}
        onBlur={(e) => {
          rhfOnBlur(e);
          eventHandlers.onBlur?.(e)
        }}
      />
      {error && <div className="invalid-feedback">{`${error.message}`}</div>}
    </div>
  )
}