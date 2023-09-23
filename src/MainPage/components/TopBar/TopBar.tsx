import { useStateValue } from "StateProvider";
import "./TopBar.css";
import React from "react";
import { ZoomButton } from "./components";

export interface Props {
  style: Object,
}

export const TopBar = ({style}: Props) => {
  const [{activeGroup, user}, ] = useStateValue();

  const handleShareClick = (e: React.MouseEvent) => {
    if(!user) return;
    navigator.clipboard.writeText(
      `${window.location.protocol}'//'${window.location.host}/${activeGroup?.id}?share=${user.uid}`
    );
  }

  return (
    <div className="topbar" style={style}>
      <p>{activeGroup?.name}</p>
      <ZoomButton />
      <div className="topbar_action_buttons">
        <button onClick={(e)=>handleShareClick(e)}> Share </button>
      </div>
    </div>
  )
}