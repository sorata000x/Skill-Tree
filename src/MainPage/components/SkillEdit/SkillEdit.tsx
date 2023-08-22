import React from "react";
import "./SkillEdit.css";
import { ActionButtons, SkillEditForm } from "./components";

// A panel to edit a skill.
export const SkillEdit = () => {
  return (
    <div className="skill_edit" onMouseDown={(e) => e.stopPropagation()}>
      <ActionButtons />
      <SkillEditForm />
    </div>
  );
};
