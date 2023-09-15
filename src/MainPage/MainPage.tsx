import "./MainPage.css";
import React, { useEffect } from "react";
import { useStateValue } from "StateProvider";
import { useNavigate, useParams } from "react-router-dom";
import {
  SideBar,
  SkillTree,
  SkillEdit,
  HelpButton,
} from "./components";
import { Skill } from "types";

/**
 * Main page of the skill trees including:
 * - SideBar    | side bar that contains various utilities  (left)
 * - SkillTree  | the skill tree                            (middle)
 * - HelpButton | ? help button                             (bottom right)
 * - SkillEdit  | side window to edit skill                 (right, open by clicking skill node)
 * - popUp      | pop up window (UserAuthDialog, SupportPage, UpdateLog)
 */
export const MainPage = () => {
  const [{ skills, activeSkill, groups, activeGroup, popUp }, dispatch] =
    useStateValue();
  const pathParam = useParams().pathParam; // get current group from url parameter
  const navigate = useNavigate();

  useEffect(() => {
    // Set active group based on current URL or set to the first group if no path param
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
    // Cancel active skill
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    });
  };

  return (
    <div className="main_page">
      <div className="container" onMouseDown={handleMouseDown}>
        <SideBar />
        <SkillTree
          skills={skills.filter((skill: Skill) => skill.group.id === activeGroup?.id)}
        />
        <HelpButton />
        <SkillEdit open={!!activeSkill} />
      </div>
      { popUp }
    </div>
  );
};
