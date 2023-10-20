import { getOffset } from "utilities";
import "./AddSkillButton.css";
import React, { createRef, useEffect, useState } from "react";
import { useMain } from "StateProvider";
import { SkillSelectMenu } from "../SkillSelectMenu";
import { Skill } from "types";

export interface Props {
  addActionSkill: (skill: Skill)=>void
}

export const AddSkillButton = ({addActionSkill}: Props) => {
  const [{}, dispatch] = useMain();
  const buttonRef: React.LegacyRef<HTMLButtonElement> = createRef();

  const handleButtonClick = (e: React.MouseEvent) => {
    const offset = getOffset(buttonRef);
    dispatch({
      type: "SET_POP_UP",
      popUp: <SkillSelectMenu 
                style={{top: offset?.top, left: offset?.left+78}}
                addActionSkill={(skill)=>addActionSkill(skill)}
              />
    })
  }

  return (
    <div className="d-flex flex-column">
      <button 
        className="add_skill_button" 
        ref={buttonRef}
        onClick={(e)=>handleButtonClick(e)}
        >
        +
      </button>
    </div>
  )
}