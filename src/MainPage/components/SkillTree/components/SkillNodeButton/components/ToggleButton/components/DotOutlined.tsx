// @ts-nocheck
import { useStateValue } from "StateProvider";
import React, { useEffect, useState } from "react";

export interface Props {
  hover: boolean,
  style?: Object,
}

export const DotOutlined = ({hover, style}: Props) => {
  const [{theme}, ] = useStateValue();

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
          style={{fill: theme === "light" ? "white" : "#212121", strokeWidth: "0.264583"}}
          id="path1"
          cx="100"
          cy="100"
          r="100" />
        <circle
          style={{fill: "currentColor", strokeWidth: "0.264583"}}
          id="path2"
          cx="100"
          cy="100"
          r="80" />
        <circle
          style={{fill: theme === "light" ? "white" : "#212121", fillOpacity: "1", strokeWidth: "0.264583"}}
          id="path3"
          cx="100"
          cy="100"
          r="50" />
      </g>
    </svg>
  )
}