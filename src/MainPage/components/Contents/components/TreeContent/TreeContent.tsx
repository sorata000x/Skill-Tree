import "./TreeContent.css";
import React from "react";
import { TopBar, SkillTree, HelpButton, SkillEdit } from "./components";
import { Skill } from "types";
import { TreeProvider, useUser, useMain, useTree } from "StateProvider";

export const TreeContent = () => {
  const [{ skills }, ] = useUser();
  const [{ activeSkill, activeGroup }, ] = useMain();
  const [{ buttons }, ] = useTree();

  return (
    <TreeProvider>
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
    </TreeProvider>
  )
}