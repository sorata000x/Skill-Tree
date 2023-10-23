import "./TreeContent.css";
import React, { createRef, useEffect } from "react";
import { TopBar, SkillTree, HelpButton, SkillEdit } from "./components";
import { Buttons, Skill } from "types";
import { TreeProvider, useUser, useMain, useTree } from "StateProvider";

export const TreeContent = () => {
  const [{ skills }, ] = useUser();
  const [{ activeSkill, activeGroup }, ] = useMain();
  const [{ buttons }, dispatchTree] = useTree();
  
  useEffect(() => {
    const newButtons: Buttons = {};
    for(const skill of skills) {
      newButtons[skill.id] = createRef();
    }
    dispatchTree({
      type: "SET_BUTTONS",
      buttons: newButtons,
    })
  }, [skills])

  return (
    <>
      <div className="layout_column">
        <TopBar style={{width: activeSkill ? "calc(100% - 556px)" : "100%"}} />
        <SkillTree 
          skills={skills.filter(
            (skill: Skill) => skill.group.id === activeGroup?.id
          )}
          buttons={buttons}
        />
      </div>
      <HelpButton />
      <SkillEdit open={!!activeSkill} />
    </>
  )
}