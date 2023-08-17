import React, { useEffect } from "react";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SkillNodeContainer } from "../SkillNodeContainer";
import "./SkillNodeLayer.css";
import { useDroppable } from "@dnd-kit/core";
import { Buttons, Skill } from "types";
import { v4 as uuid } from "uuid";

export interface Props {
  id: string              // id of current layer (which is the parent skill id, root if none)
  skills: Array<Skill>,   // all current skills
  buttons: Buttons,
  isDragOverlay?: boolean, // whether the layer is used by DragOverlay
}

// One row of skill nodes.
export const SkillNodeLayer = ({ id, skills, buttons, isDragOverlay }: Props) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext
      id={id}
      items={skills}
      strategy={horizontalListSortingStrategy}
    >
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
    </SortableContext>
  );
}

export default SkillNodeLayer;
