import React from "react";
import { FiSidebar } from "react-icons/fi";
import "./OpenSideBarButton.css";

export interface Props {
  handleClick: Function,
}

export const OpenSideBarButton = ({handleClick}: Props) => {
  return (
    <button 
      title="open side bar"
      className="open_sidebar_button" 
      onClick={(e) => handleClick(e)}
    >
      <FiSidebar />
    </button>
  );
};