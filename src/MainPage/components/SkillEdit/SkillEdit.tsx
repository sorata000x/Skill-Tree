import React from "react";
import "./SkillEdit.css";
import { ActionButtons, SkillEditForm } from "./components";

export interface Props {
  open: boolean,
}

// A panel to edit a skill.
export const SkillEdit = ({open}: Props) => {
  if(!open) return;
  return (
    <div 
      className="skill_edit" 
      onMouseDown={(e)=>e.stopPropagation()}
      >
      <ActionButtons />
      <SkillEditForm />
    </div>
  );
};
