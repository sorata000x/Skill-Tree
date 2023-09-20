// @ts-nocheck
import React, { useEffect, useState } from "react";

export interface Props {
  hover: boolean,
  style?: Object,
}

export const DotFilled = ({hover, style}: Props) => {
  const [name, setName] = useState("dot-filled");

  useEffect(() => {
    setName(hover ? "dot-filled-hover" : "dot-filled");
  }, [hover])

  return (
    <img 
      alt="dot-filled" 
      src={require(`images/${name}.svg`)}
      style={style}
      />
  )
}