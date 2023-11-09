import React from "react";
import { FiSidebar } from "react-icons/fi";

export interface Props {
  handleClick: Function;
}

/**
 * Open side bar if clicked (top left if SideBar is closed)
 */
export const OpenSideBarButton = ({ handleClick }: Props) => {
  return (
    <button
      title="open side bar"
      className="btn btn-primary icon-btn"
      onClick={(e) => handleClick(e)}
    >
      <FiSidebar />
    </button>
  );
};
