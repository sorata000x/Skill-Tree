import "./MainPage.css";
import React, { useEffect, useState } from "react";
import { useStateValue } from "StateProvider";
import { useParams } from "react-router-dom";
import { SideBar, SkillTree, SkillEdit, UserAuthDialog } from "./components";
import { Skill, Data } from "types";

export const MainPage = () => {
  const [{skills, activeSkill}, dispatch] = useStateValue();
  const groupId = useParams().pathParam;   // get current group from url parameter
  const [authOpen, setAuthOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // cancel active skill
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    });
  };

  useEffect(() => {
    console.log('Main Page re-rendered')
  }, [])

  return (
    <>
      <div className="main_page" onClick={(e) => handleClick(e)}>
        <SideBar openAuth={() => setAuthOpen(true)} />
        <SkillTree skills={skills.filter((skill: Skill) => skill.group.id === groupId)} />
        {activeSkill ? <SkillEdit /> : null}
      </div>
      <UserAuthDialog open={authOpen} close={() => setAuthOpen(false)} />
    </>
  );
}
