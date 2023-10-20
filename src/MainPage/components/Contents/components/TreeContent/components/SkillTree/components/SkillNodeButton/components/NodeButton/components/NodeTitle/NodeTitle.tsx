import "./NodeTitle.css";
import React, { useRef, useEffect } from "react";
import { Skill } from "types";
import textfit from "textfit";

export interface Props {
  skill: Skill;
  isDragOverlay?: boolean;
}

/**
 * Skill title text that shrinks to fit the node button size
 */
export const NodeTitle = ({
  skill,
  isDragOverlay,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

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
      ref={ref}
    >
      {skill.title}
    </div>
  );
};
