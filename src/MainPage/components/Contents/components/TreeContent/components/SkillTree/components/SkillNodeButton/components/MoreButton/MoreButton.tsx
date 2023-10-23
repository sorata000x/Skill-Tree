import React, { useEffect, useState } from "react";
import "./MoreButton.css";
import { FiMoreVertical, FiMoreHorizontal } from "react-icons/fi";
import { MoreMenu } from "./components";
import { useMain } from "StateProvider";
import { Skill } from "types";

export interface Props {
  open: boolean,
  skill: Skill,
}

export const MoreButton = ({open, skill}: Props) => {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [{popUp, activeSkill}, dispatch] = useMain();

  useEffect(() => {
    if(!popUp) {
      setMoreMenuOpen(false);
    }
  }, [popUp])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMoreMenuOpen(true);
    dispatch({
      type: "SET_POP_UP",
      popUp: <MoreMenu
               style={{ top: e.clientY + 20, left: e.clientX }} // set MoreMenu position near clicked position
               skill={skill}
             />,
    })
  };

  // Show if open or menu open and SkillEdit not opened
  if ((!open && !moreMenuOpen) || activeSkill) return;

  return (
    <>
      <div className="more_button" onClick={(e)=>handleClick(e)}> 
        <FiMoreHorizontal size={30} />
      </div>
    </>
  )
}