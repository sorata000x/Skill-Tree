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
    <div className="d-grid" style={{height: "70px", width: "70px"}}>
      <button 
        className="action_skill_button bg-primary text-primary">
        {skill?.icon ? 
          <img
            alt="skill icon"
            src={skill?.icon?.url}
            style={{ width: 70, height: 70 }}
          /> : null }
        {skill.title}
      </button>
      <div className="level_edit">
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