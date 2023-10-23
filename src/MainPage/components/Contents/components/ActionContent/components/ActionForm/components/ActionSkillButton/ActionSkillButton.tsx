import { Skill } from "types";
import "./ActionSkillButton.css";
import React, {useEffect, useState} from "react";

export interface Props {
  actionSkill: {
    skill: Skill,
    levelChange: string,
  }
}

export const ActionSkillButton = ({actionSkill}: Props) => {
  const {skill} = actionSkill;
  const [levelChange, setLevelChange] = useState(actionSkill.levelChange);

  useEffect(() => {
    actionSkill.levelChange = levelChange;
  }, [levelChange])

  return (
    <div className="d-flex flex-column">
      <button 
        className="add_skill_button" 
        >
        {skill?.icon ? 
          <img
            alt="skill icon"
            src={skill?.icon?.url}
            style={{ width: 100, height: 100 }}
          /> : null }
        {skill.title}
      </button>
      <div className="level">
        <input
          id="level"
          type="text"
          value={levelChange}
          onChange={(e)=>setLevelChange(e.target.value)}
        />
      </div>
    </div>
  )
}