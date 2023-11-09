import { DraftEditor } from "MainPage/components/DraftEditor";
import "./ActionForm.css";
import React, { useEffect, useState } from "react";
import { AddSkillButton, ActionSkillButton } from "./components";
import { Action, Skill } from "types";
import { useMain, useUser } from "StateProvider";
import { v4 as uuid } from "uuid";

export interface Props {
  action: Action | null,
}

export const ActionForm = ({action}: Props) => {
  const [{actions}, dispatchUser] = useUser();
  const [{activeAction}, dispatchMain] = useMain();

  useEffect(() => {
    if(!action) return;
    dispatchMain({
      type: "SET_ACTIVE_ACTION",
      id: action.id,
      actions: actions,
    }) 
  }, [actions])

  const addActionSkill = (skill: Skill) => {
    if(!action) return;
    dispatchUser({
      type: "ADD_ACTION_SKILL",
      id: action.id,
      skill: skill,
    })
    dispatchMain({
      type: "CLOSE_POP_UP",
    })
  }

  const handleChange = async (id: string, value: any) => {
    if (!activeAction) return;
    // Set input data to storage
    switch (id) {
      case "title": {
        console.log(`value: ${value}`)
        activeAction.title = value;
        break;
      }
      case "description": {
        console.log(`value: ${value}`)
        activeAction.description = value;
        break;
      }
      default: {
        return;
      }
    }
    dispatchUser({
      type: "SET_ACTION",
      action: activeAction,
    });
  };

  if(!activeAction) return;

  return (
    <div className="d-flex flex-column" style={{width: "453px"}}>
      <input 
        style={{fontSize: "22pt", margin: "12px 10px 10px 14px"}}
        name="title"
        type="text"
        placeholder="Untitled"
        value={activeAction?.title}
        onChange={e=>handleChange('title', e.target.value)}
      />
      <DraftEditor 
        key={`action_${activeAction?.id}`} 
        style={{ width: "90%", height: "300px", margin: "0px 10px 10px 18px" }}
        value={activeAction?.description}
        onChange={(v)=>handleChange('description', v)}
      />
      <label style={{fontSize: "12pt", margin: "0 0 0 8px"}}>
        Skills
      </label>
      <hr className="solid" />
      <div className="d-flex gap-3 p-3 flex-wrap align-content-start justify-content-start" style={{height: "220px", overflowX: "hidden", overflowY: "scroll"}}>
        {action?.actionSkills.map(actionSkill => <ActionSkillButton actionSkill={actionSkill}/>)}
        <AddSkillButton addActionSkill={addActionSkill}/>
      </div>
    </div>
  )
}