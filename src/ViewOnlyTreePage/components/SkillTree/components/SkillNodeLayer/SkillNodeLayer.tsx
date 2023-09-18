import React from "react";
import { SkillNodeContainer } from "../SkillNodeContainer";
import "./SkillNodeLayer.css";
import { useDroppable } from "@dnd-kit/core";
import { Buttons, Skill } from "types";

export interface Props {
  id: string; // id of current layer (which is the parent skill id, root if none)
  skills: Array<Skill>; // all current skills
  buttons: Buttons;
  isDragOverlay?: boolean; // whether the layer is used by DragOverlay
}

/**
 * Contain a row of skill nodes, sortable with Dnd-kit Sortable
 * - SkillNodeContainer | contains one node in the row and its children
 */
export const SkillNodeLayer = ({
  id,
  skills,
  buttons,
  isDragOverlay,
}: Props) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="skill_node_layer">
      {skills.map((skill) =>
        skill.parent === id ? (
          <SkillNodeContainer
            key={skill.id}
            skill={skill}
            skills={skills}
            buttons={buttons}
            isDragOverlay={isDragOverlay}
          />
        ) : null
      )}
    </div>
  );
};

export default SkillNodeLayer;
