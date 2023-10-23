import { useMain, useUser } from "StateProvider";
import "./ActionTab.css";
import React from "react";

export interface Props {
  id: string,
  title: string,
  active: boolean,
}

export const ActionTab = ({id, title, active}: Props) => {
  const [, dispatchMain] = useMain();
  const [{actions}, ] = useUser();

  const handleClick = (e: React.MouseEvent) => {
    dispatchMain({
      type: "SET_ACTIVE_ACTION",
      id: id,
      actions: actions,
    })
  }

  return (
    <button
      className={"action_tab" + (active ? " active" : "")}
      onClick={(e) => handleClick(e)}
    >
        <div style={{width: "232px", overflow: "hidden"}}>{title}</div>
        <button> Complete </button>
    </button>
  )
}