import { useUser, useMain } from "StateProvider";
import "./SkillSelectMenu.css";
import React, { useEffect, useState } from "react";
import { SkillButton } from "./components";
import { Skill } from "types";

export interface Props {
  style: Object,
  addActionSkill: (skill: Skill)=>void,
}

export const SkillSelectMenu = ({style, addActionSkill}: Props) => {
  const [{skills}, ] = useUser();
  const [, dispatchMain] = useMain();
  const [searchName, setSearchName] = useState("");

  const close = () => {
    dispatchMain({
      type: "CLOSE_POP_UP",
    })
  }

  return (
    <div className="_menu_overlay" onClick={(e)=>close()}>
      <div className="skill_select_menu" style={style} onClick={(e)=>e.stopPropagation()}>
        <div
          className="d-flex flex-column m-2"
        >
          <input 
            placeholder="Search"
            value={searchName}
            onChange={(e)=>setSearchName(e.target.value)}
          />
          <div style={{height: "2px"}}></div>
          <div 
            className="d-flex flex-column overflow-scroll"
            style={{gap: "2px", height: "160px"}}
            >
            {
              skills
              .filter(skill => skill.title.includes(searchName))
              .map(skill => 
              <SkillButton 
                key={skill.id} 
                skill={skill} 
                addActionSkill={addActionSkill}/>) 
            }
          </div>
        </div>
      </div>
    </div>
  )
}