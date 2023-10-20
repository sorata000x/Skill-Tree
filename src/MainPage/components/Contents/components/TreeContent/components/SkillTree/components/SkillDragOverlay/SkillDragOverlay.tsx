import "./SkillDragOverlay.css";
import React from "react";
import {
  DragOverlay,
  defaultDropAnimation,
} from "@dnd-kit/core";
import { useTree, useMain } from "StateProvider";
import { SkillNodeContainer } from "../SkillNodeContainer";

export const SkillDragOverlay = () => {
  const [{dragOverlay}, ] = useTree();
  const [{activeGroup}, ] = useMain();

  const dropAnimation = {
    ...defaultDropAnimation,
  };

  if (!dragOverlay) return;

  return (
    <DragOverlay
      adjustScale={true}
      dropAnimation={dropAnimation}
      >
        <div
          style={{
            transformOrigin: 'top left',
            transform: `scale(${activeGroup?.zoom})`}}   // adjust tree size according to group zoom only for root so to not repeat scaling
        >
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