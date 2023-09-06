import "./InputGroup.css";
import React from "react";

export interface Props {
  className: string,
  id: string,
  type: string,
  label: string,
  value?: any,
  handleChange: (v: any) => Promise<void>;
  min?: number,
  max?: number,
  accept?: string,
  placeHolder?: string,
}

export const InputGroup = ({ 
  id, 
  className, 
  type, 
  label, 
  value, 
  handleChange, 
  min=0, 
  max=0,
  accept="",
  placeHolder=""
}: Props) => {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        autoComplete="off"
        value={value}
        onChange={(e)=>handleChange(e.target.value)}
        min={min}
        max={max}
        accept={accept}
        placeholder={placeHolder}
      />
    </div>
  );
}