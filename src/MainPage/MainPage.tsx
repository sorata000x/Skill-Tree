import "./MainPage.css";
import React, { useEffect } from "react";
import { useStateValue } from "StateProvider";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { SideBar, SkillTree, SkillEdit, HelpButton } from "./components";
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
  const [{ skills, activeSkill, groups, activeGroup, popUp, user }, dispatch] =
    useStateValue();
  const pathParam = useParams().pathParam; // get current group from url parameter
  const navigate = useNavigate();

  // Get the search parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // Get a specific query parameter
  const share = searchParams.get('share');

  useEffect(() => {
    console.log(`queryParamValue: ${share}`)
  }, [share])

  useEffect(() => {
    // Set active group based on current URL or set to the first group if no path param
    if (pathParam) {
      dispatch({
        type: "SET_ACTIVE_GROUP",
        id: pathParam,
      });
    } else if (groups.length) {
      dispatch({
        type: "SET_ACTIVE_GROUP",
        id: groups[0].id,
      });
      navigate(`/${groups[0].id}`);
    } else {
      navigate(`/`);
    }
    // need groups as dependency because it updates after page load
  }, [groups]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Cancel active skill
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    });
  };

  const handleShareClick = (e: React.MouseEvent) => {
    if(!user) return;
    navigator.clipboard.writeText(
      `${window.location.protocol}'//'${window.location.host}/${activeGroup?.id}?share=${user.uid}`
    );
  }

  useEffect(() => {
    console.log(JSON.stringify(skills.filter(
      (skill: Skill) => skill.group.id === activeGroup?.id
    )))
  }, [activeGroup])

  return (
    <div className="main_page">
      <div className="container" onMouseDown={handleMouseDown}>
        <SideBar />
        <SkillTree
          skills={skills.filter(
            (skill: Skill) => skill.group.id === activeGroup?.id
          )}
        />
        <div className="topbar">
          {activeGroup?.id}
          <div className="topbar_action_buttons">
            <button onClick={(e)=>handleShareClick(e)}> Share </button>
          </div>
        </div>
        <HelpButton />
        <SkillEdit open={!!activeSkill} />
      </div>
      {popUp}
    </div>
  );
};
