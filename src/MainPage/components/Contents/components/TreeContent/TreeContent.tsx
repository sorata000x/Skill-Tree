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
    <div style={{width: "100%", height: "100%", overflow: "scroll"}}>
      <div className="d-flex flex-column full-size"
        >
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
    </div>
  )
}