import React from "react";
import { FiSidebar } from "react-icons/fi";
import "./CloseSideBarButton.css";

export interface Props {
  handleClick: Function;
}

/**
 * Closes side bar if clicked (top right of SideBar)
 */
export const CloseSideBarButton = ({ handleClick }: Props) => {
  return (
    <button
      title="close side bar"
      className="close_side_bar_button"
      onClick={(e)=>handleClick(e)}
    >
      <FiSidebar />
    </button>
  );
};
