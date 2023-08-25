import "./MainPage.css";
import React, { useEffect } from "react";
import { useStateValue } from "StateProvider";
import { useParams } from "react-router-dom";
import {
  SideBar,
  SkillTree,
  SkillEdit,
  PopUps,
} from "./components";
import { Skill } from "types";

export const MainPage = () => {
  const [{ skills, activeSkill, activeGroup }, dispatch] =
    useStateValue();
  const pathParam = useParams().pathParam; // get current group from url parameter

  useEffect(() => {
    dispatch({
      type: "SET_ACTIVE_GROUP",
      id: pathParam,
    })
  }, [])

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
        <div className="container">
          <SideBar />
          <SkillTree
            skills={skills.filter((skill: Skill) => skill.group.id === activeGroup?.id)}
          />
          {activeSkill ? <SkillEdit /> : null}
        </div>
      </div>
      <PopUps />
    </>
  );
};
