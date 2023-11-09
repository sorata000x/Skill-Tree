import { useMain, useUser } from "StateProvider";
import "./ActionLogTab.css";
import React from "react";
import { ActionLog } from "types";

export interface Props {
  actionLog: ActionLog,
}

export const ActionLogTab = ({actionLog}: Props) => {
  const [, dispatchMain] = useMain();
  const [{actions}, dispatchUser] = useUser();

  const handleRevertClick = (e: React.MouseEvent) => {
    for(const actionSkill of actionLog.action.actionSkills) {
      actionSkill.skill.level = actionSkill.skill.level - parseInt(actionSkill.levelChange);
      actionSkill.skill.level = actionSkill.skill.level >= 0 ? actionSkill.skill.level : 0
      if(actionSkill.skill.level > actionSkill.skill.maxLevel) actionSkill.skill.maxLevel = actionSkill.skill.level;
      dispatchUser({
        type: "SET_SKILL",
        id: actionSkill.skill.id,
        skill: actionSkill.skill,
      });
    }
    dispatchUser({
      type: "REVERT_ACTION",
      id: actionLog.id,
    })
  }

  return (
    <button
      className="tab bg-secondary">
      <div className="w-100">{actionLog.action.title}</div>
      <button
        className="btn passive-text-btn"
        onClick={e=>handleRevertClick(e)}> 
        Revert
      </button>
    </button>
  )
}