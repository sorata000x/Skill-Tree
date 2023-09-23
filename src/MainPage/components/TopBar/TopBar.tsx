import { useStateValue } from "StateProvider";
import "./TopBar.css";
import React from "react";
import { ZoomButton } from "./components";

export const TopBar = () => {
  const [{activeGroup, user}, ] = useStateValue();

  const handleShareClick = (e: React.MouseEvent) => {
    if(!user) return;
    navigator.clipboard.writeText(
      `${window.location.protocol}'//'${window.location.host}/${activeGroup?.id}?share=${user.uid}`
    );
  }

  return (
    <div className="topbar">
      <p>{activeGroup?.name}</p>
      <ZoomButton />
      <div className="topbar_action_buttons">
        <button onClick={(e)=>handleShareClick(e)}> Share </button>
      </div>
    </div>
  )
}