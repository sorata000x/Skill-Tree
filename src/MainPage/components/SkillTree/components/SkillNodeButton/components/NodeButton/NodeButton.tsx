import "./NodeButton.css";
import React, { useEffect, useState } from "react";
import { useStateValue } from "StateProvider";
import { Skill } from "types";
import { NodeTitle, SkillPreview, SkillLink } from "./components";

export interface Props {
  skill: Skill;
  buttonRef: React.RefObject<HTMLButtonElement>;
  listeners: any;
  isDragOverlay?: boolean;
}

export const NodeButton = ({
  skill,
  buttonRef,
  listeners,
  isDragOverlay,
}: Props) => {
  const [{ activeSkill, buttons, dragOverlay }, dispatch] = useStateValue();
  const [isActive, setActive] = useState(false);
  const [isMouseOver, setMouseOver] = useState(false);

  useEffect(() => {
    setActive(activeSkill?.id === skill.id); // Update active
  }, [activeSkill, skill]);

  const handleClick = (e: Event) => {
    if (isDragOverlay) {
      return;
    }
    e.stopPropagation();
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: skill,
    });
  };

  return (
    <div
      className="node_button"
      onMouseOver={()=>setMouseOver(true)}
      onMouseOut={()=>setMouseOver(false)}
    >
      <SkillLink 
        skill={skill} 
        buttons={isDragOverlay ? { ...buttons, ...dragOverlay.buttons} : buttons}
        isDragOverlay={isDragOverlay} 
      />
      <button
        className={isActive ? " active" : ""}
        ref={buttonRef}
        onClick={handleClick}
        {...listeners}
      >
        {skill.image ? <img alt="skill" src={skill.image} /> : null}
      </button>
      <SkillPreview open={isMouseOver} skill={skill} />
      <NodeTitle
        skill={skill}
        listeners={listeners}
        isDragOverlay={isDragOverlay}
      />
    </div>
  );
};
