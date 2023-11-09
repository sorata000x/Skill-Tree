import React from "react";
import { useParams } from "react-router-dom";
import { SideBar, Contents } from "./components";
import { MainProvider, useMain } from "StateProvider";

export interface Props {
  page?: string,
}

/**
 * Main page of the skill trees including:
 * - SideBar    | side bar that contains various utilities  (left)
 * - SkillTree  | the skill tree                            (middle)
 * - HelpButton | ? help button                             (bottom right)
 * - SkillEdit  | side window to edit skill                 (right, open by clicking skill node)
 * - popUp      | pop up window (UserAuthDialog, SupportPage, UpdateLog)
 */
export const MainPage = ({page}: Props) => {
  const [{ popUp }, dispatch] = useMain();
  const pathParam = useParams().pathParam; // get current group from url parameter

  const handleMouseDown = (e: React.MouseEvent) => {
    // Cancel active skill
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    });
  };

  return (
    <div 
      className="bg-primary text-primary"
      style={{width: "100vw", height: "100vh"}}>
      <div 
        className="d-flexa" 
        onMouseDown={handleMouseDown}
        style={{width: "100vw", height: "100vh", overflow: "hidden", display: "flex"}}>
        <SideBar />
        <Contents type={pathParam} />
      </div>
      {popUp}
    </div>
  );
};
