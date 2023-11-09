import { useMain, useUser } from "StateProvider";
import "./ActionTab.css";
import React from "react";
import { Action } from "types";

export interface Props {
  action: Action,
  active: boolean,
}

export const ActionTab = ({action, active}: Props) => {
  const [, dispatchMain] = useMain();
  const [{actions}, dispatchUser] = useUser();

  const handleClick = (e: React.MouseEvent) => {
    dispatchMain({
      type: "SET_ACTIVE_ACTION",
      id: action.id,
      actions: actions,
    })
  }

  const handleCompleteClick = (e: React.MouseEvent) => {
    for(const actionSkill of action.actionSkills) {
      actionSkill.skill.level = actionSkill.skill.level + parseInt(actionSkill.levelChange);
      if(actionSkill.skill.level > actionSkill.skill.maxLevel) actionSkill.skill.maxLevel = actionSkill.skill.level;
      dispatchUser({
        type: "SET_SKILL",
        id: actionSkill.skill.id,
        skill: actionSkill.skill,
      });
    }
    dispatchUser({
      type: "COMPLETE_ACTION",
      id: action.id,
    })
  }

  return (
    <button
      className={"tab" + (active ? " active" : "")}
      onClick={(e) => handleClick(e)}>
      <div className="w-100">{action.title ? action.title : "Untitled"}</div>
      <button
        className="btn passive-text-btn"
        onClick={e=>handleCompleteClick(e)}> 
        Complete 
      </button>
    </button>
  )
}