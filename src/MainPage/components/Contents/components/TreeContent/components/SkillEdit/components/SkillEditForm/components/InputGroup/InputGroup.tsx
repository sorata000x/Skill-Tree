import React from "react";

export interface Props {
  className: string;
  style?: Object;
  id: string;
  type: string;
  label: string;
  value?: any;
  handleChange: (v: any) => Promise<void>;
  min?: number;
  max?: number;
  accept?: string;
  placeHolder?: string;
}

/**
 * Input group including label and input field
 */
export const InputGroup = ({
  id,
  className,
  style,
  type,
  label,
  value,
  handleChange,
  min = 0,
  max = 0,
  accept = "",
  placeHolder = "",
}: Props) => {
  return (
    <div className={className} style={style}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        autoComplete="off"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        min={min}
        max={max}
        accept={accept}
        placeholder={placeHolder}
      />
    </div>
  );
};
