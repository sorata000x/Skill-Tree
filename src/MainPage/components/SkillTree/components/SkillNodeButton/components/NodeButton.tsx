import React, { createRef, useEffect, useState } from "react";
import { useStateValue } from "StateProvider";
import { Skill } from "types";

export interface Props {
  skill: Skill,
  buttonRef: React.RefObject<HTMLButtonElement>,
  listeners: any,
  isDragOverlay?: boolean,
}

export const NodeButton = ({
  skill, 
  buttonRef, 
  listeners, 
  isDragOverlay
}: Props) => {
  
  const [{activeSkill}, dispatch] = useStateValue();
  const [isActive, setActive] = useState(false);
 
  useEffect(() => {
    setActive(activeSkill?.id === skill.id);  // Update active
  }, [activeSkill, skill])

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
    <button
      className={ "skill_node_button" + ( isActive ? " active" : "") }
      ref={ buttonRef }
      onClick={ handleClick }
      {...listeners}
    >
      {skill.image ? (
        <img className="skill_image" alt="skill_image" src={skill.image} />
      ) : null}
    </button>
  )
}