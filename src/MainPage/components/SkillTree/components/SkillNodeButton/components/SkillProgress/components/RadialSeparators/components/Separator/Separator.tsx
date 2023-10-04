import { useStateValue } from "StateProvider";
import "./Separator.css";
import React from "react";

export interface Props {
  turns: number;
}

export const Separator = ({ turns }: Props) => {
  const [{theme}, ] = useStateValue();

  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        transform: `rotate(${turns}turn)`,
      }}
    >
      <div
        style={{
          background: theme === "light" ? "#c6c6c6" : "#212121",
          width: theme === "light" ? "2px" : "2.5px",
          // This needs to be equal to props.strokeWidth
          height: `${10}%`,
        }}
      />
    </div>
  );
};
