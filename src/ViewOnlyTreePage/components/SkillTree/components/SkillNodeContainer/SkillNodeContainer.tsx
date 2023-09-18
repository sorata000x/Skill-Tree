import React, { useState } from "react";
import { SkillNodeButton } from "../SkillNodeButton";
import "./SkillNodeContainer.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SkillNodeLayer } from "../SkillNodeLayer";
import type { Buttons, Skill } from "types";
import { FiMoreHorizontal } from "react-icons/fi";
import { useStateValue } from "StateProvider";

export interface Props {
  skill: Skill; // the root node of the subtree
  skills: Array<Skill>; // array of current skills
  buttons: Buttons; // keys of skill ids corresponding to their button reference
  isDragOverlay?: boolean; // whether this container is used by DragOverlay
}

/**
 * A subtree of skill nodes consists of one root node and its subtree.
 * - SkillNodeButton | skill node button contains skill info
 * - SkillNodeLayer  | contain row of skill node's children
 */
export const SkillNodeContainer = ({
  skill,
  skills,
  buttons,
  isDragOverlay,
}: Props) => {

  return (
    <div>
      <div className="skill_node_container">
        <SkillNodeButton
          skill={skill}
          buttonRef={buttons[skill.id]}
          isDragOverlay={isDragOverlay}
          buttons={buttons}
        />
        {skill.treeOpen ? (
          <SkillNodeLayer
            id={skill.id}
            skills={skills}
            buttons={buttons}
            isDragOverlay={isDragOverlay}
          />
        ) : null}
      </div>
    </div>
  );
};

export default SkillNodeContainer;
