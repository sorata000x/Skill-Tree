// @ts-nocheck
import React, { useEffect, useState } from "react";

export interface Props {
  hover: boolean,
  style?: Object,
}

export const DotOutlined = ({hover, style}: Props) => {
  const [name, setName] = useState("dot-outlined");

  useEffect(() => {
    setName(hover ? "dot-outlined-hover" : "dot-outlined");
  }, [hover])

  return (
    <img 
      alt="dot-outlined" 
      src={require(`images/${name}.svg`)}
      style={style}
      />
  )
}