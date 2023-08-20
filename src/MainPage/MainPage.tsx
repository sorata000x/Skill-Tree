import "./MainPage.css";
import React, { useEffect, useState } from "react";
import { useStateValue } from "StateProvider";
import { useParams } from "react-router-dom";
import { SideBar, SkillTree, SkillEdit, PopUps, SkillLinks } from "./components";
import { Skill, Data } from "types";

export const MainPage = () => {
  const [{ skills, activeSkill, buttons, dragOverlay }, dispatch] = useStateValue();
  const groupId = useParams().pathParam; // get current group from url parameter

  const handleClick = (e: React.MouseEvent) => {
    // cancel active skill
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    });
  };

  const closePopUp = () => {
    dispatch({
      type: "CLOSE_POP_UP",
    });
  };

  return (
    <>
      <div id="main_page" className="main_page" onClick={(e) => handleClick(e)}>
        <SkillLinks
          skills={[...skills.filter((skill: Skill) => skill.group.id === groupId), ...dragOverlay.skills]}
          buttons={{ ...buttons, ...dragOverlay.buttons }}
          excludes={[...dragOverlay.skills.map(skill=>skill.id)]}
        />
        <div className="container">
          <SideBar />
          <SkillTree
            skills={skills.filter((skill: Skill) => skill.group.id === groupId)}
          />
          {activeSkill ? <SkillEdit /> : null}
        </div>
        
      </div>
      <PopUps />
    </>
  );
};
