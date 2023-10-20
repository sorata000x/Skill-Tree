import { Skill } from "types";
import "./SkillButton.css";
import React from "react";

export interface Props {
  skill: Skill,
  addActionSkill: (skill: Skill)=>void,
}

export const SkillButton = ({skill, addActionSkill}: Props) => {
  const text = () => {
    if(skill.parent === "root") {
      return skill.title ? skill.title : "Untitled";
    }
    if(skill.group.id === skill.parent) {
      return `${skill.group.name}/${skill.title ? skill.title : "Untitled"}`;
    }
    return `${skill.group.name}/.../${skill.title ? skill.title : "Untitled"}`;
  }

  return (
    <button
      className="skill_button"
      onClick={(e)=>addActionSkill(skill)}
      >
      {text()} 
    </button>
  )
}