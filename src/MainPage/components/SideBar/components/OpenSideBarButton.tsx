import React from "react";
import { FiSidebar } from "react-icons/fi";

export interface Props {
  handleClick: Function,
}

export const OpenSideBarButton = ({handleClick}: Props) => {
  return (
    <button 
      title="open side bar"
      className="sidebar_button open" 
      onClick={(e) => handleClick(e)}
    >
      <FiSidebar />
    </button>
  );
};