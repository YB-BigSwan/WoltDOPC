interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  readOnly?: boolean;
  dataTestId: string;
}

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  readOnly,
  dataTestId,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={dataTestId}>{label}</label>
      <input
        id={dataTestId}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className="text-black p-2 rounded-lg"
        data-test-id={dataTestId}
      />
    </div>
  );
};

export default InputField;
