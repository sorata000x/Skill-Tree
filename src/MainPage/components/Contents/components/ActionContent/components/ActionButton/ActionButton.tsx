import "./ActionButton.css";
import React from "react";

export interface Props {
  title: string,
}

export const ActionButton = ({title}: Props) => {
  return (
    <button className="action_button">
      {title}
    </button>
  )
}