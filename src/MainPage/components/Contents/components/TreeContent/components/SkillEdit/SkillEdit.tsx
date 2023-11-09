import React from "react";
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
  return (
    <div
      className="bg-secondary position-absolute"
      style={{width: "calc(50% - 154px)", height: "100%", top: "0", right: "0", visibility: open ? "visible" : "hidden"}}
      onMouseDown={(e) => e.stopPropagation()} // prevent close on mouse down on parent
    >
      <ActionButtons />
      <SkillEditForm />
    </div>
  )
};
