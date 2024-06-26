import React from "react";
import { SkillNodeButton } from "../SkillNodeButton";
import "./SkillNodeContainer.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SkillNodeLayer } from "../SkillNodeLayer";
import type { Buttons, Skill } from "types";

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

  /* Dnd-kit Sortable */
  /* References:
   *  dnd-kit sortable documentation | https://docs.dndkit.com/presets/sortable
   *  dnd-kit sortable example: drag and drop to-do | https://codesandbox.io/s/react-drag-drop-todo-rwn8d3?file=/src/components/BoardSectionList.tsx:2714-2726 */

  const { listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: skill.id,
      transition: { duration: 300, easing: "ease" },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div 
        className="skill_node_container"
        >
        <SkillNodeButton
          buttons={buttons}
          skill={skill}
          buttonRef={buttons[skill.id]}
          listeners={skill.parent !== "root" ? listeners : null}
          isDragOverlay={isDragOverlay}
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
