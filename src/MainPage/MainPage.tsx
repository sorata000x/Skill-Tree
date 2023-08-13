import "./MainPage.css";
import React, { useState } from "react";
import { useStateValue } from "StateProvider";
import { useParams } from "react-router-dom";
import { SideBar, SkillTree, SkillEdit, UserAuthDialog } from "./components";
import { Skill } from "types";

export const MainPage = () => {
  const [{ skills, activeSkill }, dispatch] = useStateValue();
  const groupId = useParams().pathParam;   // get current group from url parameter
  const [authOpen, setAuthOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // cancel active skill
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    });
  };

  return (
    <>
      <div className="skill_container" onClick={(e) => handleClick(e)}>
        <SideBar openAuth={() => setAuthOpen(true)} />
        <div className="skill_tree_outer_container">
          <SkillTree skills={skills.filter((skill: Skill) => skill.group.id === groupId)} />
        </div>
        {activeSkill ? <SkillEdit /> : null}
      </div>
      <UserAuthDialog open={authOpen} close={() => setAuthOpen(false)} />
    </>
  );
}
