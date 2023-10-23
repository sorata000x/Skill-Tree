import { DraftEditor } from "MainPage/components/DraftEditor";
import "./ActionForm.css";
import React, { useEffect, useState } from "react";
import { AddSkillButton, ActionSkillButton } from "./components";
import { Action, Skill } from "types";
import { useMain, useUser } from "StateProvider";

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
    <div className="action_form">
      <input 
        name="title"
        type="text"
        placeholder="Untitled"
        value={activeAction?.title}
        onChange={e=>handleChange('title', e.target.value)}
      />
      <DraftEditor 
        key={activeAction?.description}
        style={{ width: "90%", height: "300px" }}
        value={activeAction?.description}
        onChange={(v)=>handleChange('description', v)}
      />
      <label>Skills</label>
      <hr className="solid" />
      <div className="d-inline-flex gap-3 pt-2 flex-wrap overflow-scroll" style={{height: "220px"}}>
        {action?.actionSkills.map(actionSkill => <ActionSkillButton actionSkill={actionSkill}/>)}
        <AddSkillButton addActionSkill={addActionSkill}/>
      </div>
    </div>
  )
}