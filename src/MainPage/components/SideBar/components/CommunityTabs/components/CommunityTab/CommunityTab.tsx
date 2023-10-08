import "./CommunityTab.css";
import React from "react";

export interface Props {
  title: string,
}

export const CommunityTab = ({title}: Props) => {
  return (
    <div className="community_tab">
      <div style={{width: "232px", overflow: "hidden"}}>{title}</div>
    </div>
  )
}