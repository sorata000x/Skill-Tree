import React, { useState } from "react";
import "./SkillNodeButton.css";
import { useStateValue } from "StateProvider";
import "react-circular-progressbar/dist/styles.css";
import { LevelChangeButtons, NodeButton, NodeTitle, SkillProgress } from "./components";
import { Skill } from "types";

export interface Props {
  skill: Skill,
  buttonRef: React.RefObject<HTMLButtonElement>,
  listeners: any,
  isDragOverlay?: boolean,
}

// A button of skill node
export const SkillNodeButton = ({ 
  skill, 
  buttonRef, 
  listeners, 
  isDragOverlay 
}: Props) => {
  const [isMouseOver, setMouseOver] = useState(false);
  const [{ activeSkill }, dispatch] = useStateValue();

  return (
    <div
      className="skill_node_button container"
      onMouseOver={(e) => {
        setMouseOver(true);
      }}
      onMouseLeave={(e) => {
        setMouseOver(false);
      }}
    >
      <NodeButton
        skill={skill}
        buttonRef={buttonRef}  
        listeners={listeners}
        isDragOverlay={isDragOverlay}
      />
      <NodeTitle 
        skill={skill}
        listeners={listeners}
        isDragOverlay={isDragOverlay}
      />
      <SkillProgress 
        skill={skill}
      />
      { isMouseOver ? 
        <LevelChangeButtons skill={skill}/> 
        : null }
    </div>
  );
}
