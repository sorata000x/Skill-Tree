import "./NodeTitle.css";
import React, { useRef, useEffect } from "react";
import { Skill } from "types";
import textfit from "textfit";

export interface Props {
  skill: Skill;
  listeners: any;
  isDragOverlay?: boolean;
  handleClick: (e: React.MouseEvent) => void;
}

/**
 * Skill title text that shrinks to fit the node button size
 */
export const NodeTitle = ({
  skill,
  listeners,
  isDragOverlay,
  handleClick,
}: Props) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current)
      textfit(ref.current, {
        alignVert: true,
        multiLine: true,
        maxFontSize: 20,
      });
  });

  return (
    <div
      className="node_title"
      onClick={(e) => handleClick(e)}
      ref={ref}
      {...listeners}
    >
      {skill.title}
    </div>
  );
};
