import React from "react";
import "./SkillEdit.css";
import { ActionButtons, SkillEditForm } from "./components";

export interface Props {
  open: boolean;
}

/**
 * Skill edit window on the right of the page, show if a skill is activated
 * - ActionButtons | close button, delete button (top)
 * - SkillEditForm | inputs to edit skill infos
 */
export const SkillEdit = ({ open }: Props) => {
  return open ? (
    <div
      className="skill_edit"
      onMouseDown={(e) => e.stopPropagation()} // prevent close on mouse down on parent
    >
      <ActionButtons />
      <SkillEditForm />
    </div>
  ) : null;
};
