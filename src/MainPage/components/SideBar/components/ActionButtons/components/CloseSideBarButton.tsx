import React from "react";
import { FiSidebar } from "react-icons/fi";

export interface Props {
  handleClick: Function,
}

export const CloseSideBarButton = ({handleClick}: Props) => {
  return (
    <button 
      title="close side bar"
      className="sidebar_button close" 
      onClick={(e) => handleClick(e)}
    >
      <FiSidebar />
    </button>
  );
};