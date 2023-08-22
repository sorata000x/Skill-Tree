import { useStateValue } from "StateProvider";
import "./MoreButton.css";
import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { Group } from "types";

export interface Props {
  open: boolean,
  group: Group,
  handleClick: Function,
}

export const MoreButton = ({ open, group, handleClick }: Props) => {
  const [, dispatch] = useStateValue();

  return (
    <button 
      className="more_button"
      title="more">
      <FiMoreHorizontal
        className="more_button"
        size={21}
        onClick={(e)=>handleClick(e)}
      />
    </button>
  )
}