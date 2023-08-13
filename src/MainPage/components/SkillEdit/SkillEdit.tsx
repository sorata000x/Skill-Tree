import React from "react";
import "./SkillEdit.css";
import { ActionButtons } from "./components";
import { SkillEditForm } from "./components/SkillEditForm/SkillEditForm";

// A panel to edit a skill.
export const SkillEdit = () => {
  return (
    <div className="skill_edit_container" onClick={(e) => e.stopPropagation()}>
      <ActionButtons />
      <SkillEditForm />
    </div>
  );
}
