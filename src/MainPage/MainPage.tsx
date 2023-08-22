import "./MainPage.css";
import React from "react";
import { useStateValue } from "StateProvider";
import { useParams } from "react-router-dom";
import {
  SideBar,
  SkillTree,
  SkillEdit,
  PopUps,
  SkillLinks,
} from "./components";
import { Skill } from "types";

export const MainPage = () => {
  const [{ skills, activeSkill, buttons, dragOverlay }, dispatch] =
    useStateValue();
  const groupId = useParams().pathParam; // get current group from url parameter

  const handleMouseDown = (e: React.MouseEvent) => {
    // cancel active skill
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    });
  };

  return (
    <>
      <div id="main_page" className="main_page" onMouseDown={(e) => handleMouseDown(e)}>
        <SkillLinks
          skills={[
            ...skills.filter((skill: Skill) => skill.group.id === groupId),
            ...dragOverlay.skills,
          ]}
          buttons={{ ...buttons, ...dragOverlay.buttons }}
          excludes={[...dragOverlay.skills.map((skill) => skill.id)]}
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
