import React from "react";
import { FiSidebar } from "react-icons/fi";

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
      className="btn btn-primary icon-btn"
      onClick={(e) => handleClick(e)}
    >
      <FiSidebar />
    </button>
  );
};
