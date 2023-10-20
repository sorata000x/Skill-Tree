import { DraftEditor } from "MainPage/components/DraftEditor";
import "./ActionForm.css";
import React, { useEffect, useState } from "react";
import { AddSkillButton, ActionSkillButton } from "./components";
import { Action, Skill } from "types";
import { useUser } from "StateProvider";

export interface Props {
  action: Action | null,
}

export const ActionForm = ({action}: Props) => {
  const [temp, setTemp] = useState("");
  const [, dispatch] = useUser();

  const addActionSkill = (skill: Skill) => {
    if(!action) return;
    dispatch({
      type: "ADD_ACTION_SKILL",
      id: action.id,
      skill: skill,
    })
  }

  return (
    <div className="action_form">
      <input 
        id="123"
        name="123"
        type="text"
        placeholder="Untitled"
      />
      <DraftEditor 
        style={{ width: "90%", height: "300px" }}
        value={temp}
        onChange={(e)=>{setTemp(e)}}
      />
      <label>Skills</label>
      <hr className="solid" />
      <div className="d-flex gap-3 pt-2">
        {action?.actionSkills.map(actionSkill => <ActionSkillButton actionSkill={actionSkill}/>)}
        <AddSkillButton addActionSkill={addActionSkill}/>
      </div>
    </div>
  )
}