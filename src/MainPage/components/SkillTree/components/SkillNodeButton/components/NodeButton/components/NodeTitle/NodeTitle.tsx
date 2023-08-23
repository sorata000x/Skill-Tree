import "./NodeTitle.css";
import React from "react";
import { useStateValue } from "StateProvider";
import { Skill } from "types";

export interface Props {
  skill: Skill;
  listeners: any;
  isDragOverlay?: boolean;
  handleClick: (e: React.MouseEvent)=>void;
  handleDoubleClick: (e: React.MouseEvent)=>void;
}

export const NodeTitle = ({ skill, listeners, isDragOverlay, handleClick, handleDoubleClick }: Props) => {
  const [, dispatch] = useStateValue();

  return (
    <div 
      className="node_title" 
      onClick={(e)=>handleClick(e)}
      onDoubleClick={(e)=>handleDoubleClick(e)}
      {...listeners}>
      {skill.title}
    </div>
  );
};
