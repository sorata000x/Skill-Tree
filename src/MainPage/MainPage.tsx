import "./MainPage.css";
import React, { useEffect } from "react";
import { useStateValue } from "StateProvider";
import { useNavigate, useParams } from "react-router-dom";
import {
  SideBar,
  SkillTree,
  SkillEdit,
  PopUps,
  HelpButton,
} from "./components";
import { Skill } from "types";

export const MainPage = () => {
  const [{ skills, activeSkill, groups, activeGroup, user }, dispatch] =
    useStateValue();
  const pathParam = useParams().pathParam; // get current group from url parameter
  const navigate = useNavigate();

  useEffect(() => {
    if (pathParam) {
      dispatch({
        type: "SET_ACTIVE_GROUP",
        id: pathParam,
      })
    } else if (groups.length) {
      dispatch({
        type: "SET_ACTIVE_GROUP",
        id: groups[0].id,
      })
      navigate(`/${groups[0].id}`);
    }
    // need groups as dependency because it updates after page load
  }, [groups]);

  useEffect(() => {
    if(activeGroup)
      navigate(`/${activeGroup.id}`);
    else
      navigate(`/`);
  }, [activeGroup])

  const handleMouseDown = (e: React.MouseEvent) => {
    // cancel active skill
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    });
  };

  return (
    <div id="main_page" className="main_page" onMouseDown={(e) => handleMouseDown(e)}>
      <div className="container">
        <SideBar />
        <SkillTree
          skills={skills.filter((skill: Skill) => skill.group.id === activeGroup?.id)}
        />
        {activeSkill ? <SkillEdit /> : null}
      </div>
      <HelpButton />
      <PopUps />
    </div>
  );
};
