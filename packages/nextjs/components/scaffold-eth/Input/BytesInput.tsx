import { forwardRef, useCallback } from "react";
import { bytesToString, isHex, toBytes, toHex } from "viem";
import { CommonInputProps, InputBase } from "~~/components/scaffold-eth";

export const BytesInput = forwardRef<HTMLInputElement, CommonInputProps>(
  ({ value, onChange, name, placeholder, disabled }, ref) => {
    const convertStringToBytes = useCallback(() => {
      onChange(isHex(value) ? bytesToString(toBytes(value)) : toHex(toBytes(value)));
    }, [onChange, value]);

    return (
      <InputBase
        ref={ref}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={newValue => onChange(newValue.toString())}
        disabled={disabled}
        suffix={
          <div
            className="self-center cursor-pointer text-xl font-semibold px-4 text-accent"
            onClick={convertStringToBytes}
          >
            #
          </div>
        }
      />
    );
  },
);

BytesInput.displayName = "BytesInput";
