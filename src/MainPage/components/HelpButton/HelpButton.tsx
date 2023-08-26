import "./HelpButton.css"
import React, { useState } from "react";
import { BsQuestionLg } from "react-icons/bs";
import { HelpMenu } from "./components";

export const HelpButton = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenu(true);
  }

  return (
    <div className="help_button">
      <HelpMenu open={openMenu} close={()=>setOpenMenu(false)} />
      <button onClick={(e)=>handleClick(e)}>
        <BsQuestionLg size={22} />
      </button>
    </div>
  )
}