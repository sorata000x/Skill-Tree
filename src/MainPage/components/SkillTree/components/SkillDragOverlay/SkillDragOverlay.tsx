import "./SkillDragOverlay.css";
import React from "react";
import {
  DragOverlay,
  defaultDropAnimation,
} from "@dnd-kit/core";
import { useStateValue } from "StateProvider";
import { SkillNodeContainer } from "../SkillNodeContainer";

export const SkillDragOverlay = () => {
  const [{dragOverlay, activeGroup}, ] = useStateValue();

  const dropAnimation = {
    ...defaultDropAnimation,
  };

  if (!dragOverlay) return;

  return (
    <DragOverlay
      adjustScale={true}
      dropAnimation={dropAnimation}
      >
        <div style={{transform: `scale(${activeGroup?.zoom})`, transformOrigin: "top left"}}>
          {dragOverlay.skills.length ? (
            <SkillNodeContainer
              key={dragOverlay.skills[0] ? dragOverlay.skills[0].id : null}
              skill={dragOverlay.skills[0]}
              skills={dragOverlay.skills}
              buttons={dragOverlay.buttons}
              isDragOverlay={true}
            />
          ) : null}
        </div>
    </DragOverlay>
  )
}