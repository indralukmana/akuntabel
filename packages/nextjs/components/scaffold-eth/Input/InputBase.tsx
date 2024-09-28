import { ChangeEvent, FocusEvent, InputHTMLAttributes, ReactNode, forwardRef, useCallback, useRef } from "react";
import { Hex } from "viem";
import { CommonInputProps } from "~~/components/scaffold-eth";

type InputBaseProps<T> = Partial<CommonInputProps<T>> & {
  prefix?: ReactNode;
  suffix?: ReactNode;
  reFocus?: boolean;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
};

export const InputBase = forwardRef<HTMLInputElement, InputBaseProps<string | bigint | Hex>>(
  (
    {
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
      type = "text",
      inputClassName,
      wrapperClassName,
      ...rest
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLInputElement>(null);
    const inputRef = ref || innerRef;

    let modifier = "";
    if (error) {
      modifier = "border-error";
    } else if (disabled) {
      modifier = "border-disabled bg-base-300";
    }

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onChange && onChange(e.target.value as any);
      },
      [onChange],
    );

    const onFocus = (e: FocusEvent<HTMLInputElement, Element>) => {
      if (reFocus !== undefined) {
        e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length);
      }
    };

    return (
      <div className={`w-full ${wrapperClassName ? wrapperClassName : ""}`}>
        <div className={`flex border-2 border-base-300 bg-base-200 rounded-full text-accent ${modifier}`}>
          {prefix}
          <input
            className={`input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400 ${
              inputClassName ? inputClassName : ""
            }`}
            placeholder={placeholder}
            name={name}
            value={value?.toString()}
            onChange={handleChange}
            disabled={disabled}
            autoComplete="off"
            ref={inputRef}
            onFocus={onFocus}
            type={type}
            {...rest}
          />
          {suffix}
        </div>
        {errorMessage && <p className="text-error">{errorMessage}</p>}
      </div>
    );
  },
);

InputBase.displayName = "InputBase";
