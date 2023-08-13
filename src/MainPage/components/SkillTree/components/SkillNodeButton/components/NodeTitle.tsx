import React from 'react'
import { useStateValue } from 'StateProvider';
import { Skill } from 'types';

export interface Props {
  skill: Skill,
  listeners: any,
  isDragOverlay?: boolean,
}

export const NodeTitle = ({
  skill, 
  listeners, 
  isDragOverlay
}: Props) => {

  const [{}, dispatch] = useStateValue();

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
      className="skill_node_title"
      onClick={handleClick}
      {...listeners}
      >{skill.title}</div>
  )
}
