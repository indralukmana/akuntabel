import { ChangeEvent, FocusEvent, InputHTMLAttributes, ReactNode, useCallback, useEffect, useRef } from "react";
import { CommonInputProps } from "~~/components/scaffold-eth";

type InputBaseProps<T> = Partial<CommonInputProps<T>> & {
  prefix?: ReactNode;
  suffix?: ReactNode;
  reFocus?: boolean;
  type?: InputHTMLAttributes<HTMLInputElement>["type"]; // Add this line
};

export const InputBase = <T extends { toString: () => string } | undefined = string>({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  errorMessage,
  disabled,
  prefix,
  suffix,
  reFocus,
  type = "text", // Add this line with a default value
  ...rest
}: InputBaseProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  let modifier = "";
  if (error) {
    modifier = "border-error";
  } else if (disabled) {
    modifier = "border-disabled bg-base-300";
  }

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange && onChange(e.target.value as unknown as T);
    },
    [onChange],
  );

  const onFocus = (e: FocusEvent<HTMLInputElement, Element>) => {
    if (reFocus !== undefined) {
      e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length);
    }
  };

  useEffect(() => {
    if (reFocus !== undefined && reFocus === true) inputRef.current?.focus();
  }, [reFocus]);

  return (
    <div className="w-full">
      <label htmlFor={name}>{label ?? name}</label>
      <div className={`flex border-2 border-base-300 bg-base-200 rounded-full text-accent ${modifier}`}>
        {prefix}
        <input
          className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
          placeholder={placeholder}
          name={name}
          value={value?.toString()}
          onChange={handleChange}
          disabled={disabled}
          autoComplete="off"
          ref={inputRef}
          onFocus={onFocus}
          type={type} // Add this line
          {...rest}
        />
        {suffix}
      </div>
      {errorMessage && <p className="text-error">{errorMessage}</p>}
    </div>
  );
};
