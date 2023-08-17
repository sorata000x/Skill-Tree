import React, { useEffect, useState } from "react";
import "./SkillNodeButton.css";
import "react-circular-progressbar/dist/styles.css";
import { NodeButton, NodeTitle, SkillProgress, LevelChangeButtons } from "./components";
import { Skill } from "types";
import { useStateValue } from "StateProvider";

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
  const [, dispatch] = useStateValue();

  // Set the level of the skill for this button.
  const setLevel = (level: number) => {
    skill.level = level;
    dispatch({
      type: "SET_SKILL",
      id: skill.id,
      skill: skill,
    });
  };

  return (
    <div
      className="skill_node_button"
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
        id={skill.id}
        level={skill.level}
        maxLevel={skill.maxLevel}
      />
      { isMouseOver ? 
        <LevelChangeButtons
          level={skill.level}
          maxLevel={skill.maxLevel}
          increaseBy={skill.increaseBy}
          setLevel={setLevel}/> 
        : null }
    </div>
  );
}