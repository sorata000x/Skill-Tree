import "./PopUps.css";
import React from "react";
import { useStateValue } from "StateProvider";
import { MorePopUp, UserAuthDialog } from "./components";

export const PopUps = () => {
  const [{popUp}, dispatch] = useStateValue();

  const handleOnClick = (e: React.MouseEvent) => {
    dispatch({
      type: "CLOSE_POP_UP"
    })
  }

  return (
    popUp ?
    <div 
      className="pop_ups"
      onClick={handleOnClick} 
      >
      <UserAuthDialog />
      <MorePopUp />
    </div>
    : null
  )
}