// @ts-nocheck
import React from "react";

export interface Props {
  hover: boolean,
  style?: Object,
}

export const DotFilled = ({hover, style}: Props) => {
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 200 200"
      version="1.1"
      id="svg1"
      className={hover ? "hover-in" : "default"}
      style={style}>
      <g>
        <circle
          style={{fill: "currentColor", strokeWidth: "0.264583"}}
          id="path2"
          cx="100"
          cy="100"
          r="80" />
      </g>
    </svg>
  )
}